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
          `SELECT * FROM (
             SELECT DISTINCT ON (cs.id)
               cs.id, cs.author_name,
               COALESCE(u.avatar_config, cs.author_avatar) AS author_avatar,
               COALESCE(NULLIF(u.neurodivergences, '{}'), cs.author_neurodivergences) AS author_neurodivergences,
               cs.kind, cs.title, cs.content, cs.external_url, cs.image_url, cs.credits, cs.created_at::text, cs.created_at AS sort_ts
             FROM community_submissions cs
             LEFT JOIN users u ON u.id = cs.user_id OR (cs.user_id IS NULL AND LOWER(u.name) = LOWER(cs.author_name))
             WHERE cs.status = 'approved'
             ORDER BY cs.id, cs.created_at DESC
           ) sub
           ORDER BY sort_ts DESC`
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
          `SELECT cl.submission_id, cl.user_id, cl.user_name, COALESCE(u.avatar_config, cl.user_avatar) AS user_avatar, cl.created_at::text
           FROM community_likes cl
           LEFT JOIN users u ON u.id = cl.user_id
           ORDER BY cl.created_at DESC`
        ),
        query<CommentItem>(
          `SELECT cc.id, cc.submission_id, cc.user_id, cc.user_name, COALESCE(u.avatar_config, cc.user_avatar) AS user_avatar, cc.content, cc.created_at::text, cc.updated_at::text
           FROM community_comments cc
           LEFT JOIN users u ON u.id = cc.user_id
           ORDER BY cc.created_at ASC`
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
