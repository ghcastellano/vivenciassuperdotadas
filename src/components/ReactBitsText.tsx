"use client";

import { motion } from "motion/react";
import { useSensory } from "@/components/SensoryProvider";
import React from "react";

/**
 * Editorial Split-Reveal Headline inspired by React Bits text animations,
 * automatically honoring prefers-reduced-motion and SensoryProvider.
 */
export function BlurRevealText({
  text,
  className = "",
  as = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p" | "span";
}) {
  const { reducedMotion } = useSensory();
  const Tag = as;

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tag className={className}>{text}</Tag>
    </motion.div>
  );
}

/**
 * SpotlightCard inspired by React Bits: subtle radial warmth follows pointer on desktop.
 */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { reducedMotion, focusMode } = useSensory();
  const [coords, setCoords] = React.useState<{ x: number; y: number } | null>(null);

  return (
    <div
      onMouseMove={(e) => {
        if (reducedMotion || focusMode) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setCoords(null)}
      className={`editorial-card relative overflow-hidden rounded-2xl ${className}`}
    >
      {coords && !reducedMotion && !focusMode && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(15, 92, 77, 0.08), transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
