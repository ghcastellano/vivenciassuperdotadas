import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { query, isDatabaseConfigured } from "@/lib/db";

interface DbUser {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  role: string;
}

async function syncAvatarFromMembership(userId: string, email: string): Promise<void> {
  try {
    const rows = await query<{
      id: string;
      avatar_config: unknown;
      neurodivergences: string[];
      manifesto: string;
      has_medical_report: string;
    }>(
      `SELECT id, avatar_config, neurodivergences, manifesto, has_medical_report
       FROM memberships
       WHERE LOWER(email) = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [email.toLowerCase()]
    );
    const m = rows[0];
    if (!m) return;

    await query("UPDATE memberships SET user_id = $1 WHERE LOWER(email) = $2 AND user_id IS NULL", [
      userId,
      email.toLowerCase(),
    ]);
    await query(
      `UPDATE users
       SET avatar_config = COALESCE(avatar_config, $1),
           neurodivergences = CASE WHEN COALESCE(array_length(neurodivergences, 1), 0) = 0 THEN $2 ELSE neurodivergences END,
           manifesto = CASE WHEN COALESCE(manifesto, '') = '' THEN $3 ELSE manifesto END,
           has_medical_report = CASE WHEN COALESCE(has_medical_report, 'nao_informado') = 'nao_informado' THEN $4 ELSE has_medical_report END
       WHERE id = $5`,
      [
        JSON.stringify(m.avatar_config),
        m.neurodivergences || ["ahsd"],
        m.manifesto || "",
        m.has_medical_report || "nao_informado",
        userId,
      ]
    );
  } catch (err) {
    console.error("syncAvatarFromMembership error:", err);
  }
}

const MASTER_ADMIN_EMAIL = "ghcastellano@gmail.com";

function isAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (normalized === MASTER_ADMIN_EMAIL) return true;
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(normalized);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "vivencias-dev-secret" : undefined),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/entrar",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "E-mail e Senha",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        // Optional env-based bootstrap admin for initial setup
        const envAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const envAdminPass = process.env.ADMIN_PASSWORD;
        if (envAdminEmail && envAdminPass && email === envAdminEmail && password === envAdminPass) {
          return { id: "env-admin", name: "Administração Vivências", email, role: "admin" };
        }

        if (!isDatabaseConfigured()) return null;

        const rows = await query<DbUser>(
          "SELECT id, name, email, password_hash, role FROM users WHERE LOWER(email) = $1 LIMIT 1",
          [email]
        );
        const user = rows[0];
        if (!user || !user.password_hash) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        await syncAvatarFromMembership(user.id, user.email);
        const role = isAdminEmail(user.email) ? "admin" : user.role;
        return { id: user.id, name: user.name, email: user.email, role };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email && isDatabaseConfigured()) {
        const email = user.email.toLowerCase();
        const existing = await query<DbUser>(
          "SELECT id, role FROM users WHERE LOWER(email) = $1 LIMIT 1",
          [email]
        );
        let userId = existing[0]?.id;
        const role = isAdminEmail(email) ? "admin" : existing[0]?.role || "member";
        if (!userId) {
          userId = crypto.randomUUID();
          await query(
            "INSERT INTO users (id, name, email, role) VALUES ($1, $2, $3, $4)",
            [userId, user.name || "Membro Vivências", email, role]
          );
        } else if (role === "admin" && existing[0]?.role !== "admin") {
          await query("UPDATE users SET role = 'admin' WHERE id = $1", [userId]);
        }
        await syncAvatarFromMembership(userId, email);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        let role = (user as { role?: string }).role || "member";
        if (user.email) {
          if (isAdminEmail(user.email)) {
            role = "admin";
          } else if (isDatabaseConfigured()) {
            const rows = await query<{ id: string; role: string }>(
              "SELECT id, role FROM users WHERE LOWER(email) = $1 LIMIT 1",
              [user.email.toLowerCase()]
            );
            if (rows[0]) {
              token.id = rows[0].id;
              role = rows[0].role;
            }
          }
        }
        token.role = role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as {
          id?: string;
          role?: string;
          membershipStatus?: string;
          memberNumber?: string;
        };
        u.id = String(token.id || "");
        u.role = String(token.role || "member");
        u.membershipStatus = "none";
        u.memberNumber = "";

        if (isDatabaseConfigured() && session.user.email) {
          try {
            const mRows = await query<{ membership_status: string; member_number: string }>(
              "SELECT membership_status, member_number FROM memberships WHERE LOWER(email) = $1 ORDER BY created_at DESC LIMIT 1",
              [session.user.email.toLowerCase()]
            );
            if (mRows[0]) {
              u.membershipStatus = mRows[0].membership_status || "pending";
              u.memberNumber = mRows[0].member_number || "";
            }
          } catch {
            // keep defaults
          }
        }
      }
      return session;
    },
  },
});
