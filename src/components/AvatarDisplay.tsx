"use client";

import React, { useMemo } from "react";
import {
  DEFAULT_AVATAR_CONFIG,
  NEURODIVERGENCE_BADGES,
  renderAvatarSvg,
  type AvatarConfig,
  type NeurodivergenceId,
} from "@/lib/avatar";

export function AvatarDisplay({
  config,
  neurodivergences = ["ahsd"],
  size = 96,
  showBadges = true,
  className = "",
}: {
  config?: Partial<AvatarConfig> | null;
  neurodivergences?: string[];
  size?: number;
  showBadges?: boolean;
  className?: string;
}) {
  const merged = useMemo(() => ({ ...DEFAULT_AVATAR_CONFIG, ...(config || {}) }), [config]);
  const svg = useMemo(() => renderAvatarSvg(merged), [merged]);

  const activeBadges = useMemo(() => {
    const set = new Set(neurodivergences);
    return NEURODIVERGENCE_BADGES.filter((b) => set.has(b.id as NeurodivergenceId));
  }, [neurodivergences]);

  const primaryColor = activeBadges[0]?.color || "#0F5C4D";
  const secondaryColor = activeBadges[1]?.color || "#D98A2B";

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <div
        className="relative rounded-full p-1"
        style={{
          width: size + 8,
          height: size + 8,
          background:
            activeBadges.length > 1
              ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
              : primaryColor,
        }}
      >
        <div
          className="h-full w-full overflow-hidden rounded-full bg-white"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <span
          title="Símbolo da neurodiversidade"
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold text-white shadow"
          style={{
            backgroundColor: primaryColor,
            borderColor: "var(--bg-card)",
          }}
        >
          ∞
        </span>
      </div>

      {showBadges && activeBadges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {activeBadges.map((badge) => (
            <span
              key={badge.id}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
              style={{ backgroundColor: badge.color }}
              title={badge.description}
            >
              <span>∞</span>
              <span>{badge.short}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
