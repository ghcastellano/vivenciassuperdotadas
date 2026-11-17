import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { Pool } from "pg";

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = path.join(process.cwd(), ".env.local");
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^DATABASE_URL=(.+)$/);
    if (match) return match[1].trim().replace(/^"|"$/g, "");
  }
  throw new Error("DATABASE_URL not found");
}

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const ROUTES = [
  "/",
  "/sobre",
  "/conhecimento",
  "/profissionais",
  "/eventos",
  "/comunidade",
  "/associe-se",
  "/loja",
  "/apoie",
  "/entrar",
  "/admin",
  "/avatar?name=Teste&n=ahsd,2e",
];

async function main() {
  const pool = new Pool({ connectionString: loadDatabaseUrl() });
  const testIds = {
    membershipId: "__pw_test_mem_1",
    profId: "__pw_test_prof_1",
    eventId: "__pw_test_ev_1",
    expenseId: "__pw_test_exp_1",
    subId: "__pw_test_sub_1",
  };

  let browser;
  try {
    // 1. Insert temporary fictional test data into Neon Postgres
    await pool.query(
      `INSERT INTO memberships (id, name, email, profile, city_state, neurodivergences, avatar_config, manifesto, show_in_directory, accepted_code)
       VALUES ($1, 'Teste Playwright', 'pw_test@example.com', 'Pessoa com AH/SD', 'São Paulo - SP', ARRAY['ahsd','dupla-excepcionalidade'], '{"seed":"pw","top":"shortWaved"}'::jsonb, 'Manifesto fictício de validação visual.', TRUE, TRUE)
       ON CONFLICT (id) DO NOTHING`,
      [testIds.membershipId]
    );
    await pool.query(
      `INSERT INTO partner_professionals (id, name, email, registry_code, specialty, approach, region, state, city, city_state, online_available, whatsapp, social_url, other_qualifications, bio, contact_url, status)
       VALUES ($1, 'Dr. Fictício Playwright', 'pw_prof@example.com', 'CRP 00/0000', 'Psicologia AH/SD', 'TCC', 'Sudeste', 'SP', 'São Paulo', 'São Paulo - SP', TRUE, '11 99999-0000', '', 'Perfil fictício temporário.', 'Perfil fictício temporário.', '', 'approved')
       ON CONFLICT (id) DO NOTHING`,
      [testIds.profId]
    );
    await pool.query(
      `INSERT INTO events (id, title, description, event_date, format, image_url, event_link, active)
       VALUES ($1, 'Evento Fictício Playwright', 'Descrição temporária de teste integrado.', NOW() + INTERVAL '7 days', 'Online', '/images/logo-vivencias.jpg', 'https://vivenciassuperdotadas.vercel.app', TRUE)
       ON CONFLICT (id) DO NOTHING`,
      [testIds.eventId]
    );
    await pool.query(
      `INSERT INTO financial_expenses (id, category, description, amount_cents, reference_date)
       VALUES ($1, 'infraestrutura', 'Despesa fictícia Playwright', 1234, CURRENT_DATE)
       ON CONFLICT (id) DO NOTHING`,
      [testIds.expenseId]
    );
    await pool.query(
      `INSERT INTO community_submissions (id, author_name, author_neurodivergences, kind, title, content, status)
       VALUES ($1, 'Autor Fictício', ARRAY['ahsd'], 'relato', 'Relato Fictício Playwright', 'Texto longo sem espaco: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'approved')
       ON CONFLICT (id) DO NOTHING`,
      [testIds.subId]
    );

    // 2. Verify Auth.js providers endpoint includes Google & Credentials
    const providersRes = await fetch(`${BASE_URL}/api/auth/providers`);
    assert.equal(providersRes.status, 200);
    const providers = await providersRes.json();
    assert.ok(providers.google, "Google OAuth provider must be enabled");
    assert.ok(providers.credentials, "Credentials provider must be enabled");
    console.log("✔ Auth providers verified:", Object.keys(providers).join(", "));

    // 3. Launch Playwright using Edge/Chrome installed on Windows
    browser = await chromium.launch({
      channel: "msedge",
      headless: true,
    });

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const pageErrors = [];
      page.on("pageerror", (err) => pageErrors.push(err.message));

      for (const route of ROUTES) {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
        const metrics = await page.evaluate(() => {
          const overflow = document.documentElement.scrollWidth > window.innerWidth + 2;
          const brokenImgs = Array.from(document.images).filter((img) => !img.complete || img.naturalWidth === 0).length;
          return { overflow, brokenImgs, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth };
        });

        assert.equal(
          metrics.overflow,
          false,
          `Horizontal overflow on ${route} (${vp.name}): ${metrics.scrollWidth} > ${metrics.innerWidth}`
        );
        assert.equal(metrics.brokenImgs, 0, `Broken images found on ${route} (${vp.name})`);
      }

      assert.equal(pageErrors.length, 0, `Page errors on ${vp.name}: ${pageErrors.join("; ")}`);
      console.log(`✔ Viewport ${vp.name} (${vp.width}x${vp.height}): ${ROUTES.length} routes passed (0 overflow, 0 broken images, 0 JS errors)`);
      await context.close();
    }

    // 4. Functional UI checks: WhatsApp link on /profissionais, Cart on /loja, Admin tabs on /admin, Google login button on /entrar
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    await page.goto(`${BASE_URL}/profissionais`, { waitUntil: "networkidle" });
    const waLinks = await page.locator('a[href*="wa.me/55"]').count();
    assert.ok(waLinks >= 1, "Expected WhatsApp wa.me/55 link on /profissionais");
    console.log(`✔ /profissionais WhatsApp links verified (${waLinks} found)`);

    await page.goto(`${BASE_URL}/loja`, { waitUntil: "networkidle" });
    await page.locator('button:has-text("Adicionar")').first().click();
    await page.locator('button:has-text("Abrir carrinho")').click();
    await page.locator('aside[aria-label="Carrinho de compras"]').waitFor({ state: "visible" });
    console.log("✔ /loja cart add + drawer verified");

    await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle" });
    await page.locator('text=Portão do Milênio').waitFor({ state: "visible" });
    await page.locator('textarea').fill("Seja s = 1/2 + it, QED");
    await page.locator('button:has-text("Verificar Demonstração")').click();
    await page.locator('[role="status"]').waitFor({ state: "visible" });
    console.log("✔ /admin Millennium Gate & mathematical proof check verified");

    await page.goto(`${BASE_URL}/entrar`, { waitUntil: "networkidle" });
    const googleBtn = page.locator('button:has-text("Continuar com Google (Gmail)")');
    await googleBtn.waitFor({ state: "visible" });
    console.log("✔ /entrar Google OAuth button verified");

    await ctx.close();
  } finally {
    if (browser) await browser.close();
    // 5. Always clean up all temporary fictional test data from Neon Postgres
    await pool.query("DELETE FROM memberships WHERE id = $1", [testIds.membershipId]);
    await pool.query("DELETE FROM partner_professionals WHERE id = $1", [testIds.profId]);
    await pool.query("DELETE FROM events WHERE id = $1", [testIds.eventId]);
    await pool.query("DELETE FROM financial_expenses WHERE id = $1", [testIds.expenseId]);
    await pool.query("DELETE FROM community_submissions WHERE id = $1", [testIds.subId]);
    await pool.end();
    console.log("✔ Temporary fictional test data cleaned up from Neon Postgres");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
