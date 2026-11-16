import test from "node:test";
import assert from "node:assert/strict";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

test("DiceBear avatar SVG generation produces valid SVG", () => {
  const svg = createAvatar(avataaars, { seed: "vivencias-test", radius: 50 }).toString();
  assert.ok(svg.startsWith("<svg"));
  assert.ok(svg.includes("</svg>"));
});

test("BRL formatting helper logic formats cents cleanly", () => {
  const format = (cents) =>
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  assert.match(format(8900), /89,00/);
});
