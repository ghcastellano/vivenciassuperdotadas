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
  };

  if (isDatabaseConfigured()) {
    try {
      const rows = await query<MeUser>(
        `SELECT name, email, role, avatar_config, neurodivergences, manifesto, has_medical_report
         FROM users
         WHERE LOWER(email) = $1
         LIMIT 1`,
        [session.user.email.toLowerCase()]
      );
      if (rows[0]) me = rows[0];
    } catch {
      // keep session fallback
    }
  }

  return <PerfilClient initialMe={me} />;
}
