import { NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";

export async function POST(req: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ ok: true, persisted: false });
    }
    const body = await req.json();
    const moduleName = String(body.module || "unificado");
    const ahsdScore = Number(body.ahsdScore || 0);
    const reasoningScore = Number(body.reasoningScore || 0);
    const reasoningTotal = Number(body.reasoningTotal || 0);

    await query(
      `INSERT INTO exploration_stats (id, module, ahsd_score, reasoning_score, reasoning_total)
       VALUES ($1, $2, $3, $4, $5)`,
      [crypto.randomUUID(), moduleName, ahsdScore, reasoningScore, reasoningTotal]
    );

    return NextResponse.json({ ok: true, persisted: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
