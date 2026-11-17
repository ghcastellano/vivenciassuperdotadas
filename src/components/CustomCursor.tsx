"use client";

import { useEffect, useState } from "react";
import { useSensory } from "@/components/SensoryProvider";

export function CustomCursor() {
  const { customCursor, reducedMotion } = useSensory();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFinePointer && customCursor);
  }, [customCursor]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement | null;
      const labeled = target?.closest("[data-cursor-label]") as HTMLElement | null;
      const interactive = target?.closest("a, button, input, select, textarea, [role='button']");
      setLabel(labeled?.getAttribute("data-cursor-label") || null);
      setActive(Boolean(interactive || labeled));
    };

    const onLeave = () => setPos(null);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled || !pos) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-50 hidden md:flex items-center gap-2 ${
        reducedMotion ? "" : "transition-transform duration-100 ease-out"
      }`}
      style={{
        transform: `translate3d(${pos.x - (active ? 16 : 10)}px, ${pos.y - (active ? 16 : 10)}px, 0)`,
      }}
    >
      <div
        className="rounded-full border-2 transition-all duration-150 flex items-center justify-center"
        style={{
          width: label ? "auto" : active ? 32 : 20,
          height: label ? 28 : active ? 32 : 20,
          padding: label ? "0 12px" : 0,
          borderColor: active ? "var(--accent-crimson)" : "var(--accent-emerald)",
          backgroundColor: label
            ? "var(--accent-emerald)"
            : active
            ? "color-mix(in srgb, var(--accent-crimson) 18%, transparent)"
            : "color-mix(in srgb, var(--accent-emerald) 12%, transparent)",
          color: "#FAF7F2",
        }}
      >
        {label && <span className="text-[11px] font-semibold whitespace-nowrap">{label}</span>}
      </div>
    </div>
  );
}
