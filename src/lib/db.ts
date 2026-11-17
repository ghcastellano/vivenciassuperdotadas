import { Pool, type QueryResultRow } from "pg";
import { attachDatabasePool } from "@vercel/functions";

declare global {
  // eslint-disable-next-line no-var
  var __vivenciasPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __vivenciasSchemaPromise: Promise<void> | undefined;
}

function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  if (!global.__vivenciasPool) {
    const pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
    });
    attachDatabasePool(pool);
    global.__vivenciasPool = pool;
  }

  return global.__vivenciasPool;
}

export async function ensureSchema(): Promise<void> {
  const pool = getPool();
  if (!pool) return;

  if (!global.__vivenciasSchemaPromise) {
    global.__vivenciasSchemaPromise = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT,
          role TEXT NOT NULL DEFAULT 'member',
          avatar_config JSONB,
          neurodivergences TEXT[] DEFAULT '{}',
          manifesto TEXT DEFAULT '',
          has_medical_report TEXT DEFAULT 'nao_informado',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        ALTER TABLE users ADD COLUMN IF NOT EXISTS has_medical_report TEXT DEFAULT 'nao_informado';

        CREATE TABLE IF NOT EXISTS memberships (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          profile TEXT NOT NULL,
          city_state TEXT DEFAULT '',
          neurodivergences TEXT[] DEFAULT '{}',
          avatar_config JSONB NOT NULL,
          manifesto TEXT DEFAULT '',
          has_medical_report TEXT DEFAULT 'nao_informado',
          show_in_directory BOOLEAN NOT NULL DEFAULT FALSE,
          accepted_code BOOLEAN NOT NULL DEFAULT TRUE,
          membership_status TEXT NOT NULL DEFAULT 'pending',
          member_number TEXT DEFAULT '',
          terms_version TEXT DEFAULT 'estatuto-v1-2026',
          accepted_at TIMESTAMPTZ,
          approved_at TIMESTAMPTZ,
          approved_by TEXT DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        ALTER TABLE memberships ADD COLUMN IF NOT EXISTS has_medical_report TEXT DEFAULT 'nao_informado';
        ALTER TABLE memberships ADD COLUMN IF NOT EXISTS show_in_directory BOOLEAN NOT NULL DEFAULT FALSE;
        ALTER TABLE memberships ALTER COLUMN show_in_directory SET DEFAULT FALSE;
        ALTER TABLE memberships ADD COLUMN IF NOT EXISTS membership_status TEXT NOT NULL DEFAULT 'active';
        ALTER TABLE memberships ALTER COLUMN membership_status SET DEFAULT 'pending';
        ALTER TABLE memberships ADD COLUMN IF NOT EXISTS member_number TEXT DEFAULT '';
        ALTER TABLE memberships ADD COLUMN IF NOT EXISTS terms_version TEXT DEFAULT 'estatuto-v1-2026';
        ALTER TABLE memberships ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;
        ALTER TABLE memberships ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
        ALTER TABLE memberships ADD COLUMN IF NOT EXISTS approved_by TEXT DEFAULT '';

        CREATE TABLE IF NOT EXISTS partner_professionals (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT DEFAULT '',
          registry_code TEXT DEFAULT '',
          specialty TEXT NOT NULL,
          approach TEXT DEFAULT '',
          region TEXT DEFAULT '',
          state TEXT DEFAULT '',
          city TEXT DEFAULT '',
          city_state TEXT DEFAULT '',
          online_available BOOLEAN NOT NULL DEFAULT TRUE,
          whatsapp TEXT DEFAULT '',
          social_url TEXT DEFAULT '',
          other_qualifications TEXT DEFAULT '',
          service_type TEXT DEFAULT 'ambos',
          bio TEXT DEFAULT '',
          contact_url TEXT DEFAULT '',
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        ALTER TABLE partner_professionals ADD COLUMN IF NOT EXISTS region TEXT DEFAULT '';
        ALTER TABLE partner_professionals ADD COLUMN IF NOT EXISTS state TEXT DEFAULT '';
        ALTER TABLE partner_professionals ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '';
        ALTER TABLE partner_professionals ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '';
        ALTER TABLE partner_professionals ADD COLUMN IF NOT EXISTS social_url TEXT DEFAULT '';
        ALTER TABLE partner_professionals ADD COLUMN IF NOT EXISTS other_qualifications TEXT DEFAULT '';
        ALTER TABLE partner_professionals ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'ambos';
        ALTER TABLE partner_professionals ALTER COLUMN email DROP NOT NULL;
        ALTER TABLE partner_professionals ALTER COLUMN registry_code DROP NOT NULL;
        ALTER TABLE partner_professionals ALTER COLUMN approach DROP NOT NULL;
        ALTER TABLE partner_professionals ALTER COLUMN bio DROP NOT NULL;

        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          event_date TIMESTAMPTZ NOT NULL,
          format TEXT NOT NULL DEFAULT 'Online',
          image_url TEXT DEFAULT '',
          event_link TEXT NOT NULL,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS community_submissions (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
          author_name TEXT NOT NULL,
          author_avatar JSONB,
          author_neurodivergences TEXT[] DEFAULT '{}',
          kind TEXT NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          external_url TEXT DEFAULT '',
          image_url TEXT DEFAULT '',
          credits TEXT DEFAULT '',
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          price_cents INTEGER NOT NULL,
          image_url TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'Apoio',
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS stripe_transactions (
          id TEXT PRIMARY KEY,
          stripe_session_id TEXT UNIQUE,
          kind TEXT NOT NULL,
          amount_cents INTEGER NOT NULL,
          fee_cents INTEGER NOT NULL DEFAULT 0,
          currency TEXT NOT NULL DEFAULT 'brl',
          description TEXT DEFAULT '',
          customer_email TEXT DEFAULT '',
          status TEXT NOT NULL DEFAULT 'completed',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS financial_expenses (
          id TEXT PRIMARY KEY,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          amount_cents INTEGER NOT NULL,
          reference_date DATE NOT NULL DEFAULT CURRENT_DATE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS exploration_stats (
          id TEXT PRIMARY KEY,
          module TEXT NOT NULL,
          ahsd_score INTEGER DEFAULT 0,
          reasoning_score INTEGER DEFAULT 0,
          reasoning_total INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS community_likes (
          submission_id TEXT NOT NULL REFERENCES community_submissions(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL,
          user_name TEXT NOT NULL,
          user_avatar JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (submission_id, user_id)
        );
        CREATE INDEX IF NOT EXISTS idx_community_likes_submission ON community_likes(submission_id);

        CREATE TABLE IF NOT EXISTS community_comments (
          id TEXT PRIMARY KEY,
          submission_id TEXT NOT NULL REFERENCES community_submissions(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL,
          user_name TEXT NOT NULL,
          user_avatar JSONB,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS idx_community_comments_submission ON community_comments(submission_id, created_at);

        CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY,
          recipient_user_id TEXT NOT NULL,
          actor_user_id TEXT,
          actor_name TEXT NOT NULL,
          actor_avatar JSONB,
          type TEXT NOT NULL,
          submission_id TEXT NOT NULL,
          submission_title TEXT DEFAULT '',
          comment_preview TEXT DEFAULT '',
          is_read BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_user_id, is_read, created_at DESC);
      `);
    })();
  }

  await global.__vivenciasSchemaPromise;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  if (!pool) {
    throw new Error("DATABASE_URL is not configured");
  }
  await ensureSchema();
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
