import { isDatabaseConfigured, query } from "@/lib/db";
import { ProfissionaisClient, type PartnerItem } from "./ProfissionaisClient";

export const revalidate = 30;

export default async function ProfissionaisPage() {
  let partners: PartnerItem[] = [];

  if (isDatabaseConfigured()) {
    try {
      partners = await query<PartnerItem>(
        `SELECT id, name, email, registry_code, specialty, approach, region, state, city, city_state, online_available, whatsapp, social_url, other_qualifications, bio, contact_url
         FROM partner_professionals
         WHERE status = 'approved'
         ORDER BY name ASC`
      );
    } catch {
      partners = [];
    }
  }

  return <ProfissionaisClient initialPartners={partners} />;
}
