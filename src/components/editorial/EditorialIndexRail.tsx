"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export interface IndexJourneyItem {
  key: string;
  num: string;
  shortLabel: string;
  eyebrow: string;
  title: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export function EditorialIndexRail({ items }: { items: IndexJourneyItem[] }) {
  const [selected, setSelected] = useState(0);
  const current = items[selected] || items[0];

  return (
    <div
      className="grid border-y lg:grid-cols-[0.9fr_1.1fr]"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      {/* Left vertical numbered index */}
      <div className="divide-y border-b lg:border-b-0 lg:border-r" style={{ borderColor: "var(--border-subtle)" }}>
        {items.map((item, idx) => {
          const isActive = idx === selected;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelected(idx)}
              className="relative flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-7 sm:py-5 text-left transition-colors"
              style={{
                backgroundColor: isActive ? "var(--bg-surface)" : "transparent",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="index-rail-bar"
                  transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  className="absolute bottom-0 left-0 top-0 w-[3px]"
                  style={{ backgroundColor: "var(--accent-emerald)" }}
                />
              )}
              <div className="flex items-baseline gap-4">
                <span
                  className="font-mono-num text-xs font-semibold"
                  style={{ color: isActive ? "var(--accent-emerald)" : "var(--text-muted)" }}
                >
                  {item.num}
                </span>
                <span
                  className="font-display text-base sm:text-lg font-medium"
                  style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {item.shortLabel}
                </span>
              </div>
              <span
                className="text-xs font-mono-num transition-transform"
                style={{
                  color: isActive ? "var(--accent-emerald)" : "var(--text-muted)",
                  transform: isActive ? "translateX(2px)" : "none",
                }}
              >
                →
              </span>
            </button>
          );
        })}
      </div>

      {/* Right editorial detail panel */}
      <div className="flex flex-col justify-between p-6 sm:p-10" style={{ backgroundColor: "var(--bg-card)" }}>
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-mono-num text-[11px] uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
              {current.eyebrow}
            </span>
            <span className="font-display italic text-4xl sm:text-5xl opacity-20" style={{ color: "var(--text-primary)" }}>
              {current.num}
            </span>
          </div>

          <h3 className="mt-4 font-display text-2xl font-semibold leading-snug sm:text-3xl">
            {current.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
            {current.summary}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <Link
            href={current.ctaHref}
            className="btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
          >
            <span>{current.ctaLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={current.secondaryHref}
            className="link-editorial inline-flex items-center gap-1.5 py-1 text-sm font-semibold"
          >
            <span>{current.secondaryLabel}</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
