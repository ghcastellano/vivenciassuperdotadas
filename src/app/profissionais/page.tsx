import { isDatabaseConfigured, query } from "@/lib/db";
import { MOCK_PROFESSIONALS } from "@/lib/mock-data";
import { ProfissionaisClient, type PartnerItem } from "./ProfissionaisClient";

export const revalidate = 30;

export default async function ProfissionaisPage() {
  let partners: PartnerItem[] = MOCK_PROFESSIONALS;

  if (isDatabaseConfigured()) {
    try {
      const rows = await query<PartnerItem>(
        `SELECT id, name, registry_code, specialty, approach, city_state, online_available, bio, contact_url
         FROM partner_professionals
         WHERE status = 'approved'
         ORDER BY created_at DESC`
      );
      if (rows.length > 0) partners = rows;
    } catch {
      // fallback to mock
    }
  }

  return <ProfissionaisClient initialPartners={partners} />;
}
