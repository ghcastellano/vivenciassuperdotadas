import { isDatabaseConfigured, query } from "@/lib/db";
import { ComunidadeClient, type CommunitySubmissionItem, type MemberAvatarCard } from "./ComunidadeClient";

export const revalidate = 30;

export default async function ComunidadePage() {
  let submissions: CommunitySubmissionItem[] = [];
  let members: MemberAvatarCard[] = [];
  let totalMembers = 0;

  if (isDatabaseConfigured()) {
    try {
      const [subRows, memRows, countRows] = await Promise.all([
        query<CommunitySubmissionItem>(
          `SELECT id, author_name, author_avatar, author_neurodivergences, kind, title, content, external_url, image_url, credits, created_at::text
           FROM community_submissions
           WHERE status = 'approved'
           ORDER BY created_at DESC`
        ),
        query<MemberAvatarCard>(
          `SELECT id, avatar_config, neurodivergences
           FROM memberships
           WHERE show_in_directory = TRUE AND membership_status = 'active'
           ORDER BY created_at DESC
           LIMIT 60`
        ),
        query<{ count: number }>(
          `SELECT COUNT(*)::int AS count
           FROM memberships
           WHERE membership_status = 'active'`
        ),
      ]);
      submissions = subRows;
      members = memRows;
      totalMembers = countRows[0]?.count ?? memRows.length;
    } catch {
      submissions = [];
      members = [];
      totalMembers = 0;
    }
  }

  return (
    <ComunidadeClient
      initialSubmissions={submissions}
      initialMembers={members}
      totalMembers={totalMembers}
    />
  );
}
