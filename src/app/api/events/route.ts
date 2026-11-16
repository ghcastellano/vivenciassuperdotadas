import { NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ events: [] });
  }
  try {
    const rows = await query(
      `SELECT id, title, description, event_date, format, image_url, event_link, created_at
       FROM events
       WHERE active = TRUE
       ORDER BY event_date ASC`
    );
    return NextResponse.json({ events: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ events: [] });
  }
}
