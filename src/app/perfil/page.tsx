import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { PerfilClient, type MeUser } from "./PerfilClient";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.email) {
    return <PerfilClient initialMe={null} />;
  }

  let me: MeUser = {
    name: session.user.name || "Membro",
    email: session.user.email,
    role: (session.user as { role?: string }).role || "member",
    avatar_config: null,
    neurodivergences: [],
    manifesto: "",
    has_medical_report: "nao_informado",
    membership_status: (session.user as { membershipStatus?: string }).membershipStatus || "none",
    member_number: (session.user as { memberNumber?: string }).memberNumber || "",
  };

  if (isDatabaseConfigured()) {
    try {
      const [uRows, mRows] = await Promise.all([
        query<Omit<MeUser, "membership_status" | "member_number">>(
          `SELECT name, email, role, avatar_config, neurodivergences, manifesto, has_medical_report
           FROM users
           WHERE LOWER(email) = $1
           LIMIT 1`,
          [session.user.email.toLowerCase()]
        ),
        query<{ membership_status: string; member_number: string }>(
          `SELECT membership_status, member_number
           FROM memberships
           WHERE LOWER(email) = $1
           ORDER BY created_at DESC
           LIMIT 1`,
          [session.user.email.toLowerCase()]
        ),
      ]);
      if (uRows[0]) {
        me = {
          ...me,
          ...uRows[0],
        };
      }
      if (mRows[0]) {
        me.membership_status = mRows[0].membership_status || "pending";
        me.member_number = mRows[0].member_number || "";
      }
    } catch {
      // keep session fallback
    }
  }

  return <PerfilClient initialMe={me} />;
}
