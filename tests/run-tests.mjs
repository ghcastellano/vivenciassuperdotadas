import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

test("GET / returns 200 and contains Vivências Superdotadas", async () => {
  const res = await fetch(`${BASE_URL}/`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /Vivências Superdotadas/);
});

test("Public pages render cleanly with HTTP 200", async () => {
  const routes = ["/sobre", "/conhecimento", "/profissionais", "/eventos", "/associe-se", "/comunidade", "/apoie", "/loja", "/entrar"];
  for (const route of routes) {
    const res = await fetch(`${BASE_URL}${route}`);
    assert.equal(res.status, 200, `Expected 200 on ${route}`);
  }
});

test("/exploracao was removed and returns 404", async () => {
  const res = await fetch(`${BASE_URL}/exploracao`);
  assert.equal(res.status, 404);
});

test("Neon Postgres wired APIs: /api/transparency returns valid JSON", async () => {
  const res = await fetch(`${BASE_URL}/api/transparency`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.configured, true);
  assert.equal(typeof data.donationsCents, "number");
  assert.equal(typeof data.netBalanceCents, "number");
});

test("Neon Postgres wired APIs: /api/professionals, /api/events, /api/community return arrays", async () => {
  const [p, e, c] = await Promise.all([
    fetch(`${BASE_URL}/api/professionals`).then((r) => r.json()),
    fetch(`${BASE_URL}/api/events`).then((r) => r.json()),
    fetch(`${BASE_URL}/api/community`).then((r) => r.json()),
  ]);
  assert.ok(Array.isArray(p.professionals));
  assert.ok(Array.isArray(e.events));
  assert.ok(Array.isArray(c.submissions));
});

test("Admin endpoints reject unauthenticated requests with 403", async () => {
  const getRes = await fetch(`${BASE_URL}/api/admin`);
  assert.equal(getRes.status, 403);
  const postRes = await fetch(`${BASE_URL}/api/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete_event", id: "x" }),
  });
  assert.equal(postRes.status, 403);
});

test("Security guard: POST /api/community rejects unauthenticated requests with 401", async () => {
  const res = await fetch(`${BASE_URL}/api/community`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Teste", content: "Conteúdo" }),
  });
  assert.equal(res.status, 401);
});
