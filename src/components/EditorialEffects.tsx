"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useSensory } from "@/components/SensoryProvider";

export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });
  const { reducedMotion } = useSensory();

  if (reducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--accent-crimson), var(--accent-amber), var(--accent-emerald))",
      }}
    />
  );
}

export function AuroraMesh() {
  const { reducedMotion, focusMode } = useSensory();
  if (focusMode) return null;

  return (
    <div aria-hidden="true" className="decorative-only pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : { x: [0, 30, -20, 0], y: [0, -20, 20, 0], scale: [1, 1.08, 0.96, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: "var(--accent-emerald)" }}
      />
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : { x: [0, -25, 25, 0], y: [0, 25, -15, 0], scale: [1, 0.94, 1.06, 1] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-12 h-[380px] w-[380px] rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: "var(--accent-crimson)" }}
      />
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : { x: [0, 20, -25, 0], y: [0, 15, -25, 0] }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: "var(--accent-amber)" }}
      />
    </div>
  );
}

export function SplitHeadline({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const { reducedMotion } = useSensory();
  const words = text.split(" ");

  if (reducedMotion) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <h1 className={className}>
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden align-bottom mr-[0.26em]">
          <motion.span
            className="inline-block"
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.55,
              delay: idx * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export function RotatingPhrase({
  phrases,
  className = "",
}: {
  phrases: string[];
  className?: string;
}) {
  const { reducedMotion } = useSensory();
  const [index, setIndex] = useState(0);

  React.useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3200);
    return () => clearInterval(id);
  }, [phrases.length, reducedMotion]);

  if (reducedMotion) {
    return <span className={className}>{phrases[0]}</span>;
  }

  return (
    <span className={`relative inline-flex overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[index]}
          initial={{ y: 18, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -18, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function TiltedArtworkCard({
  src,
  alt,
  captionLeft,
  captionRight,
}: {
  src: string;
  alt: string;
  captionLeft: string;
  captionRight: string;
}) {
  const { reducedMotion, focusMode } = useSensory();
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || focusMode || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 10,
      ry: (px - 0.5) * 12,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const reset = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });

  return (
    <div style={{ perspective: "1100px" }} className="w-full max-w-[380px]">
      <div
        ref={ref}
        data-cursor-label="Obra original"
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="relative overflow-hidden rounded-3xl border p-3.5 shadow-2xl transition-transform duration-200 ease-out"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={src}
            alt={alt}
            className="aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
          {!reducedMotion && !focusMode && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-35 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.45), transparent 55%)`,
              }}
            />
          )}
        </div>
        <div className="mt-3 flex items-center justify-between px-1 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{captionLeft}</span>
          <span className="font-semibold" style={{ color: "var(--accent-emerald)" }}>
            {captionRight}
          </span>
        </div>
      </div>
    </div>
  );
}

export function MagneticWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { reducedMotion } = useSensory();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <div
      className={`inline-block transition-transform duration-200 ease-out ${className}`}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      onMouseMove={(e) => {
        if (reducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.14;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.14;
        setOffset({ x, y });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </div>
  );
}

export function InfiniteMarquee({ items }: { items: string[] }) {
  const { reducedMotion, focusMode } = useSensory();
  if (focusMode) return null;

  const doubled = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="decorative-only overflow-hidden border-y py-3.5 select-none"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}
    >
      <motion.div
        className="flex w-max items-center gap-8 whitespace-nowrap text-xs sm:text-sm font-semibold uppercase tracking-[0.14em]"
        style={{ color: "var(--text-secondary)" }}
        animate={reducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, idx) => (
          <span key={idx} className="inline-flex items-center gap-4">
            <span>{item}</span>
            <span style={{ color: idx % 2 === 0 ? "var(--accent-crimson)" : "var(--accent-emerald)" }}>∞</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { reducedMotion } = useSensory();
  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ImageCurtainReveal({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const { reducedMotion } = useSensory();

  if (reducedMotion) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="h-full w-full overflow-hidden"
    >
      <img
        src={src}
        alt={alt}
        className={`${className} transition-transform duration-700 hover:scale-[1.04]`}
      />
    </motion.div>
  );
}
