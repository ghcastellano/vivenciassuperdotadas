import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { AdminMillenniumGate } from "@/components/editorial/AdminMillenniumGate";
import { AdminClient, type AdminData } from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "admin") {
    return <AdminMillenniumGate />;
  }

  let initialData: AdminData = {
    readOnly: false,
    professionals: [],
    submissions: [],
    events: [],
    expenses: [],
    users: [],
    membersCount: 0,
  };

  if (isDatabaseConfigured()) {
    try {
      const [professionals, submissions, events, expenses, users, members] = await Promise.all([
        query<AdminData["professionals"][number]>(
          "SELECT id, name, email, registry_code, specialty, city_state, status FROM partner_professionals ORDER BY created_at DESC"
        ),
        query<AdminData["submissions"][number]>(
          "SELECT id, author_name, kind, title, content, status FROM community_submissions ORDER BY created_at DESC"
        ),
        query<AdminData["events"][number]>(
          "SELECT id, title, description, event_date::text, format, event_link FROM events ORDER BY event_date ASC"
        ),
        query<AdminData["expenses"][number]>(
          "SELECT id, category, description, amount_cents, reference_date::text FROM financial_expenses ORDER BY reference_date DESC, created_at DESC"
        ),
        query<AdminData["users"][number]>(
          "SELECT id, name, email, role, created_at::text FROM users ORDER BY CASE WHEN role = 'admin' THEN 0 ELSE 1 END, created_at DESC"
        ),
        query<{ count: string }>("SELECT COUNT(*) AS count FROM memberships"),
      ]);

      initialData = {
        readOnly: false,
        professionals,
        submissions,
        events,
        expenses,
        users,
        membersCount: Number(members[0]?.count || 0),
      };
    } catch {
      // keep fallback empty data
    }
  }

  return <AdminClient initialData={initialData} />;
}
