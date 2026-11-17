import { isDatabaseConfigured, query } from "@/lib/db";
import { ComunidadeClient, type CommunitySubmissionItem, type MemberAvatarCard } from "./ComunidadeClient";

export const dynamic = "force-dynamic";

export default async function ComunidadePage() {
  let submissions: CommunitySubmissionItem[] = [];
  let members: MemberAvatarCard[] = [];
  let activeMembersCount = 0;

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
           LIMIT 24`
        ),
        query<{ count: string }>(
          `SELECT COUNT(*) AS count FROM memberships WHERE membership_status = 'active'`
        ),
      ]);
      submissions = subRows;
      members = memRows;
      activeMembersCount = Number(countRows[0]?.count || 0);
    } catch {
      submissions = [];
      members = [];
      activeMembersCount = 0;
    }
  }

  return (
    <ComunidadeClient
      initialSubmissions={submissions}
      initialMembers={members}
      activeMembersCount={activeMembersCount}
    />
  );
}
