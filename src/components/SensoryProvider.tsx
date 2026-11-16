"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type FontChoice = "atkinson" | "lexend";
export type TextScale = "base" | "lg" | "xl";

interface SensoryState {
  theme: "light" | "dark";
  font: FontChoice;
  textScale: TextScale;
  reducedMotion: boolean;
  focusMode: boolean;
  customCursor: boolean;
  setTheme: (t: "light" | "dark") => void;
  setFont: (f: FontChoice) => void;
  setTextScale: (s: TextScale) => void;
  setReducedMotion: (v: boolean) => void;
  setFocusMode: (v: boolean) => void;
  setCustomCursor: (v: boolean) => void;
}

const SensoryContext = createContext<SensoryState | null>(null);

export function SensoryProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [font, setFont] = useState<FontChoice>("atkinson");
  const [textScale, setTextScale] = useState<TextScale>("base");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [customCursor, setCustomCursor] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setReducedMotion(true);

    try {
      const saved = localStorage.getItem("vivencias-sensory");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme === "dark" || parsed.theme === "light") setTheme(parsed.theme);
        if (parsed.font === "atkinson" || parsed.font === "lexend") setFont(parsed.font);
        if (parsed.textScale) setTextScale(parsed.textScale);
        if (typeof parsed.reducedMotion === "boolean") setReducedMotion(parsed.reducedMotion);
        if (typeof parsed.focusMode === "boolean") setFocusMode(parsed.focusMode);
        if (typeof parsed.customCursor === "boolean") setCustomCursor(parsed.customCursor);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-font", font);
    root.setAttribute("data-text-scale", textScale);
    root.setAttribute("data-reduced-motion", String(reducedMotion));
    root.setAttribute("data-focus-mode", String(focusMode));

    try {
      localStorage.setItem(
        "vivencias-sensory",
        JSON.stringify({ theme, font, textScale, reducedMotion, focusMode, customCursor })
      );
    } catch {
      // ignore storage errors
    }
  }, [theme, font, textScale, reducedMotion, focusMode, customCursor]);

  return (
    <SensoryContext.Provider
      value={{
        theme,
        font,
        textScale,
        reducedMotion,
        focusMode,
        customCursor,
        setTheme,
        setFont,
        setTextScale,
        setReducedMotion,
        setFocusMode,
        setCustomCursor,
      }}
    >
      {children}
    </SensoryContext.Provider>
  );
}

export function useSensory() {
  const ctx = useContext(SensoryContext);
  if (!ctx) throw new Error("useSensory must be used inside SensoryProvider");
  return ctx;
}
