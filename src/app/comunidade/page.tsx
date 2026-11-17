import { isDatabaseConfigured, query } from "@/lib/db";
import { ComunidadeClient, type CommunitySubmissionItem, type MemberAvatarCard } from "./ComunidadeClient";
import type { CommentItem, LikeUserItem } from "@/components/CommunityInteractionsModal";

export const revalidate = 60;

export default async function ComunidadePage() {
  let submissions: CommunitySubmissionItem[] = [];
  let members: MemberAvatarCard[] = [];
  let activeMembersCount = 0;
  const initialInteractions: Record<string, { likes: LikeUserItem[]; comments: CommentItem[] }> = {};

  if (isDatabaseConfigured()) {
    try {
      const [subRows, memRows, countRows, likeRows, commentRows] = await Promise.all([
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
        query<LikeUserItem & { submission_id: string }>(
          `SELECT submission_id, user_id, user_name, user_avatar, created_at::text
           FROM community_likes
           ORDER BY created_at DESC`
        ),
        query<CommentItem>(
          `SELECT id, submission_id, user_id, user_name, user_avatar, content, created_at::text, updated_at::text
           FROM community_comments
           ORDER BY created_at ASC`
        ),
      ]);
      submissions = subRows;
      members = memRows;
      activeMembersCount = Number(countRows[0]?.count || 0);

      for (const l of likeRows) {
        if (!initialInteractions[l.submission_id]) {
          initialInteractions[l.submission_id] = { likes: [], comments: [] };
        }
        initialInteractions[l.submission_id].likes.push({
          user_id: l.user_id,
          user_name: l.user_name,
          user_avatar: l.user_avatar,
          created_at: l.created_at,
        });
      }
      for (const c of commentRows) {
        if (!initialInteractions[c.submission_id]) {
          initialInteractions[c.submission_id] = { likes: [], comments: [] };
        }
        initialInteractions[c.submission_id].comments.push(c);
      }
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
      initialInteractions={initialInteractions}
    />
  );
}
