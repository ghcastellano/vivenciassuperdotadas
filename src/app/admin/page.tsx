import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { AdminMillenniumGate } from "@/components/editorial/AdminMillenniumGate";
import { AdminClient, type AdminData } from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  const emailLower = session?.user?.email?.toLowerCase() || "";
  let isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  if (!isAdmin && emailLower) {
    const envAdmins = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (emailLower === "ghcastellano@gmail.com" || envAdmins.includes(emailLower)) {
      isAdmin = true;
    } else if (isDatabaseConfigured()) {
      try {
        const rows = await query<{ role: string }>(
          "SELECT role FROM users WHERE LOWER(email) = $1 LIMIT 1",
          [emailLower]
        );
        if (rows[0]?.role === "admin") isAdmin = true;
      } catch {
        // ignore
      }
    }
  }

  if (!session?.user || !isAdmin) {
    return <AdminMillenniumGate />;
  }

  let initialData: AdminData = {
    readOnly: false,
    professionals: [],
    submissions: [],
    events: [],
    expenses: [],
    users: [],
    memberships: [],
    membersCount: 0,
  };

  if (isDatabaseConfigured()) {
    try {
      const [professionals, submissions, events, expenses, users, memberships] = await Promise.all([
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
        query<AdminData["memberships"][number]>(
          `SELECT id, name, email, profile, city_state, has_medical_report, manifesto, membership_status, member_number, accepted_at::text, created_at::text
           FROM memberships
           ORDER BY CASE WHEN membership_status = 'pending' THEN 0 WHEN membership_status = 'active' THEN 1 ELSE 2 END, created_at DESC`
        ),
      ]);

      initialData = {
        readOnly: false,
        professionals,
        submissions,
        events,
        expenses,
        users,
        memberships,
        membersCount: memberships.filter((m) => m.membership_status === "active").length,
      };
    } catch {
      // keep fallback empty data
    }
  }

  return <AdminClient initialData={initialData} />;
}
