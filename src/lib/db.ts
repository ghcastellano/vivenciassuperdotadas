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
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

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
          accepted_code BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS partner_professionals (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          registry_code TEXT NOT NULL,
          specialty TEXT NOT NULL,
          approach TEXT NOT NULL,
          city_state TEXT DEFAULT '',
          online_available BOOLEAN NOT NULL DEFAULT TRUE,
          bio TEXT NOT NULL,
          contact_url TEXT DEFAULT '',
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

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
