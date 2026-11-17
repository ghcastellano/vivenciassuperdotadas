import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { AdminClient, type AdminData } from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const readOnly = !session?.user || role !== "admin";

  let initialData: AdminData = {
    readOnly,
    professionals: [],
    submissions: [],
    events: [],
    expenses: [],
    membersCount: 0,
  };

  if (isDatabaseConfigured()) {
    try {
      const [professionals, submissions, events, expenses, members] = await Promise.all([
        query<AdminData["professionals"][number]>(
          "SELECT id, name, email, registry_code, specialty, city_state, status FROM partner_professionals ORDER BY created_at DESC"
        ),
        query<AdminData["submissions"][number]>(
          "SELECT id, author_name, kind, title, content, status FROM community_submissions ORDER BY created_at DESC"
        ),
        query<AdminData["events"][number]>(
          "SELECT id, title, event_date::text, format FROM events ORDER BY event_date ASC"
        ),
        query<AdminData["expenses"][number]>(
          "SELECT id, category, description, amount_cents, reference_date::text FROM financial_expenses ORDER BY reference_date DESC, created_at DESC"
        ),
        query<{ count: string }>("SELECT COUNT(*) AS count FROM memberships"),
      ]);

      initialData = {
        readOnly,
        professionals,
        submissions,
        events,
        expenses,
        membersCount: Number(members[0]?.count || 0),
      };
    } catch {
      // keep fallback empty data
    }
  }

  return <AdminClient initialData={initialData} />;
}
