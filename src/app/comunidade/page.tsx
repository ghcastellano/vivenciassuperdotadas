import { isDatabaseConfigured, query } from "@/lib/db";
import { MOCK_SUBMISSIONS } from "@/lib/mock-data";
import { ComunidadeClient, type CommunitySubmissionItem, type MemberAvatarCard } from "./ComunidadeClient";

export const revalidate = 30;

export default async function ComunidadePage() {
  let submissions: CommunitySubmissionItem[] = MOCK_SUBMISSIONS;
  let members: MemberAvatarCard[] = [];

  if (isDatabaseConfigured()) {
    try {
      const [subRows, memRows] = await Promise.all([
        query<CommunitySubmissionItem>(
          `SELECT id, author_name, author_avatar, author_neurodivergences, kind, title, content, external_url, image_url, credits, created_at::text
           FROM community_submissions
           WHERE status = 'approved'
           ORDER BY created_at DESC`
        ),
        query<MemberAvatarCard>(
          `SELECT id, split_part(name, ' ', 1) AS first_name, profile, avatar_config, neurodivergences, manifesto
           FROM memberships
           WHERE show_in_directory = TRUE
           ORDER BY created_at DESC
           LIMIT 24`
        ),
      ]);
      if (subRows.length > 0) submissions = subRows;
      members = memRows;
    } catch {
      // fallback to mock
    }
  }

  return <ComunidadeClient initialSubmissions={submissions} initialMembers={members} />;
}
