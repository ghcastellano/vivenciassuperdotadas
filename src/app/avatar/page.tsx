import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { DEFAULT_AVATAR_CONFIG, type AvatarConfig } from "@/lib/avatar";

export default async function AvatarCardPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; n?: string; name?: string; m?: string }>;
}) {
  const sp = await searchParams;
  let config: Partial<AvatarConfig> = DEFAULT_AVATAR_CONFIG;
  if (sp.c) {
    try {
      const decoded = Buffer.from(sp.c, "base64").toString("utf8");
      config = { ...DEFAULT_AVATAR_CONFIG, ...JSON.parse(decoded) };
    } catch {
      // fallback to default
    }
  }

  const neuro = sp.n ? sp.n.split(",").filter(Boolean) : ["ahsd"];
  const personName = sp.name || "Membro Vivências";
  const manifesto = sp.m || "";

  return (
    <div className="mx-auto max-w-xl px-5 py-16 sm:px-8">
      <div
        className="rounded-3xl border p-8 text-center space-y-6 shadow-xl"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
      >
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--accent-emerald)" }}>
            Cada pessoa é única · ∞
          </p>
          <h1 className="font-display text-3xl font-semibold">{personName}</h1>
        </div>

        <div className="flex justify-center py-2">
          <AvatarDisplay config={config} neurodivergences={neuro} size={160} />
        </div>

        {manifesto && (
          <p className="mx-auto max-w-md text-base italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            “{manifesto}”
          </p>
        )}

        <div className="border-t pt-6 space-y-3" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Associação Vivências Superdotadas — Apoio às Altas Habilidades/Superdotação e Dupla Excepcionalidade
          </p>
          <Link
            href="/associe-se"
            className="btn-primary inline-flex min-h-[46px] items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold"
          >
            <Sparkles className="h-4 w-4" />
            <span>Criar meu Avatar Único</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
