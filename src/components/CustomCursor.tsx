"use client";

import { useEffect, useState } from "react";
import { useSensory } from "@/components/SensoryProvider";

export function CustomCursor() {
  const { customCursor, reducedMotion, focusMode } = useSensory();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFinePointer && customCursor && !reducedMotion && !focusMode);
  }, [customCursor, reducedMotion, focusMode]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a, button, input, select, textarea, [role='button']");
      setActive(Boolean(interactive));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block transition-transform duration-150 ease-out"
      style={{
        transform: `translate3d(${pos.x - (active ? 18 : 10)}px, ${pos.y - (active ? 18 : 10)}px, 0)`,
      }}
    >
      <div
        className="rounded-full border transition-all duration-150"
        style={{
          width: active ? 36 : 20,
          height: active ? 36 : 20,
          borderColor: active ? "var(--accent-crimson)" : "var(--accent-emerald)",
          backgroundColor: active ? "rgba(200, 62, 55, 0.10)" : "rgba(15, 92, 77, 0.08)",
        }}
      />
    </div>
  );
}
