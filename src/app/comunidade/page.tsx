import { isDatabaseConfigured, query } from "@/lib/db";
import { MOCK_SUBMISSIONS } from "@/lib/mock-data";
import { ComunidadeClient, type CommunitySubmissionItem } from "./ComunidadeClient";

export const revalidate = 30;

export default async function ComunidadePage() {
  let submissions: CommunitySubmissionItem[] = MOCK_SUBMISSIONS;

  if (isDatabaseConfigured()) {
    try {
      const rows = await query<CommunitySubmissionItem>(
        `SELECT id, author_name, author_avatar, author_neurodivergences, kind, title, content, external_url, image_url, credits, created_at::text
         FROM community_submissions
         WHERE status = 'approved'
         ORDER BY created_at DESC`
      );
      if (rows.length > 0) submissions = rows;
    } catch {
      // fallback to mock
    }
  }

  return <ComunidadeClient initialSubmissions={submissions} />;
}
