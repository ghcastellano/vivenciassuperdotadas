import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ user: null });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      user: {
        name: session.user.name,
        email: session.user.email,
        role: (session.user as { role?: string }).role || "member",
      },
    });
  }

  const rows = await query<{
    id: string;
    name: string;
    email: string;
    role: string;
    avatar_config: unknown;
    neurodivergences: string[];
    manifesto: string;
    has_medical_report: string;
  }>(
    `SELECT id, name, email, role, avatar_config, neurodivergences, manifesto, has_medical_report
     FROM users
     WHERE LOWER(email) = $1
     LIMIT 1`,
    [session.user.email.toLowerCase()]
  );

  const dbUser = rows[0];
  return NextResponse.json({
    user: dbUser || {
      name: session.user.name,
      email: session.user.email,
      role: (session.user as { role?: string }).role || "member",
      avatar_config: null,
      neurodivergences: [],
      manifesto: "",
      has_medical_report: "nao_informado",
    },
  });
}
