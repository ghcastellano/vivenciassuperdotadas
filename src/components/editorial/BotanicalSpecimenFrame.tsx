"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface SpecimenNote {
  num: string;
  title: string;
  meaning: string;
  top: string;
  left: string;
}

const SPECIMEN_NOTES: SpecimenNote[] = [
  {
    num: "1",
    title: "Pétalas Carmesim",
    meaning: "Intensidade afetiva, senso de justiça e expressão criativa além do estereótipo puramente acadêmico.",
    top: "27%",
    left: "30%",
  },
  {
    num: "2",
    title: "Espiral Esmeralda",
    meaning: "Pensamento arborescente e em rede: conexões não-lineares, hiperfoco e síntese de ideias.",
    top: "44%",
    left: "50%",
  },
  {
    num: "3",
    title: "Borboleta",
    meaning: "Identificação tardia e metamorfose — a saída do mascaramento rumo à voz em primeira pessoa.",
    top: "18%",
    left: "77%",
  },
  {
    num: "4",
    title: "Folhas do Infinito (∞)",
    meaning: "Neurodiversidade plural: AH/SD, dupla excepcionalidade (2e) e convivência saudável sem elitismo.",
    top: "88%",
    left: "60%",
  },
];

export function BotanicalSpecimenFrame() {
  const [active, setActive] = useState<number>(1);
  const current = SPECIMEN_NOTES[active];

  return (
    <figure className="mx-auto w-full max-w-[380px]">
      <div
        className="relative border p-3 sm:p-4"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
        }}
      >
        {/* Top plate metadata */}
        <div
          className="mb-3 flex items-center justify-between border-b pb-2 font-mono-num text-[10px] uppercase tracking-widest"
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
        >
          <span>Prancha 01 · Obra Fundadora</span>
          <span>Acrílica s/ Tela</span>
        </div>

        {/* Artwork with clean interactive markers */}
        <div className="relative aspect-[3/4] w-full overflow-hidden border" style={{ borderColor: "var(--border-subtle)" }}>
          <Image
            src="/images/logo-vivencias.jpg"
            alt="Pintura original da Associação Vivências Superdotadas: flor carmesim com miolo espiral esmeralda, borboleta e folhas com infinito"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 380px"
            className="object-cover"
          />

          {SPECIMEN_NOTES.map((note, idx) => {
            const isSelected = active === idx;
            return (
              <button
                key={note.num}
                type="button"
                onClick={() => setActive(idx)}
                aria-label={`Explorar símbolo ${note.num}: ${note.title}`}
                aria-pressed={isSelected}
                style={{
                  top: note.top,
                  left: note.left,
                  backgroundColor: isSelected ? "var(--accent-emerald)" : "rgba(250, 247, 242, 0.92)",
                  color: isSelected ? "#FAF7F2" : "#171C1A",
                  borderColor: isSelected ? "#FAF7F2" : "#171C1A",
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border font-mono-num text-[11px] font-bold transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              >
                {note.num}
              </button>
            );
          })}
        </div>

        {/* Curatorial legend strip */}
        <div className="mt-3 min-h-[76px] border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono-num text-[10px] uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
              0{current.num} · {current.title}
            </span>
            <div className="flex gap-1">
              {SPECIMEN_NOTES.map((n, idx) => (
                <button
                  key={n.num}
                  type="button"
                  onClick={() => setActive(idx)}
                  aria-label={`Selecionar nota ${n.num}`}
                  className="h-1.5 w-4 transition-colors"
                  style={{
                    backgroundColor: active === idx ? "var(--accent-emerald)" : "var(--border-subtle)",
                  }}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={current.num}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="mt-1.5 text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {current.meaning}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </figure>
  );
}
