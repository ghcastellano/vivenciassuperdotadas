"use client";

import React, { useState } from "react";
import { Shuffle, Download, Share2, Check, MessageCircle } from "lucide-react";
import {
  AVATAR_OPTIONS,
  NEURODIVERGENCE_BADGES,
  renderShareableAvatarSvg,
  type AvatarConfig,
  type NeurodivergenceId,
} from "@/lib/avatar";
import { AvatarDisplay } from "@/components/AvatarDisplay";

type TabKey = "cabeca" | "rosto" | "roupa" | "neuro";

function pickRandom<T extends { value: string }>(arr: T[]): string {
  return arr[Math.floor(Math.random() * arr.length)].value;
}

export function AvatarStudio({
  config,
  onChange,
  neurodivergences,
  onNeuroChange,
  personName = "Você",
  manifesto = "",
}: {
  config: AvatarConfig;
  onChange: (next: AvatarConfig) => void;
  neurodivergences: string[];
  onNeuroChange: (next: string[]) => void;
  personName?: string;
  manifesto?: string;
}) {
  const [tab, setTab] = useState<TabKey>("cabeca");
  const [copied, setCopied] = useState(false);

  const randomize = () => {
    onChange({
      seed: Math.random().toString(36).slice(2, 10),
      top: pickRandom(AVATAR_OPTIONS.top),
      hairColor: pickRandom(AVATAR_OPTIONS.hairColor),
      skinColor: pickRandom(AVATAR_OPTIONS.skinColor),
      eyes: pickRandom(AVATAR_OPTIONS.eyes),
      eyebrows: pickRandom(AVATAR_OPTIONS.eyebrows),
      mouth: pickRandom(AVATAR_OPTIONS.mouth),
      accessories: pickRandom(AVATAR_OPTIONS.accessories),
      clothing: pickRandom(AVATAR_OPTIONS.clothing),
      clothesColor: pickRandom(AVATAR_OPTIONS.clothesColor),
      backgroundColor: pickRandom(AVATAR_OPTIONS.backgroundColor),
    });
  };

  const toggleNeuro = (id: NeurodivergenceId) => {
    if (neurodivergences.includes(id)) {
      if (neurodivergences.length === 1) return;
      onNeuroChange(neurodivergences.filter((x) => x !== id));
    } else {
      onNeuroChange([...neurodivergences, id]);
    }
  };

  const downloadSvg = () => {
    const svg = renderShareableAvatarSvg(config, neurodivergences, personName);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avatar-vivencias-${personName.toLowerCase().replace(/\s+/g, "-") || "unico"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buildShareUrl = () => {
    const params = new URLSearchParams({
      c: btoa(JSON.stringify(config)),
      n: neurodivergences.join(","),
      name: personName,
      ...(manifesto ? { m: manifesto } : {}),
    });
    return `${window.location.origin}/avatar?${params.toString()}`;
  };

  const shareAvatar = async () => {
    const shareUrl = buildShareUrl();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Avatar Único — ${personName} | Vivências Superdotadas`,
          text: manifesto || "Cada pessoa é única. Conheça meu avatar na Associação Vivências Superdotadas!",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // user cancelled share
    }
  };

  const shareWhatsApp = () => {
    const shareUrl = buildShareUrl();
    const text = encodeURIComponent(
      `Cada pessoa é única! Conheça meu Avatar Único na Associação Vivências Superdotadas: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Preview Card */}
        <div
          className="flex flex-col items-center justify-between rounded-2xl border p-5 text-center"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
              Cada pessoa é única
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold">{personName || "Seu Avatar"}</h3>
          </div>

          <div className="my-5">
            <AvatarDisplay config={config} neurodivergences={neurodivergences} size={136} />
          </div>

          {manifesto && (
            <p className="mb-4 text-xs italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              “{manifesto}”
            </p>
          )}

          <div className="flex w-full flex-col gap-2">
            <button
              type="button"
              onClick={randomize}
              className="flex min-h-[42px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            >
              <Shuffle className="h-3.5 w-3.5" />
              Gerar combinação aleatória
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={downloadSvg}
                className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border px-2 py-1.5 text-xs font-medium"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              >
                <Download className="h-3.5 w-3.5" />
                Baixar SVG
              </button>
              <button
                type="button"
                onClick={shareAvatar}
                className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border px-2 py-1.5 text-xs font-medium"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? "Copiado!" : "Copiar Link"}
              </button>
            </div>
            <button
              type="button"
              onClick={shareWhatsApp}
              className="flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold"
              style={{ borderColor: "var(--accent-emerald)", color: "var(--accent-emerald)", backgroundColor: "var(--bg-card)" }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Compartilhar no WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Customization Controls */}
        <div>
          <div className="mb-5 flex flex-wrap gap-2 border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
            {(
              [
                ["cabeca", "Cabeça & Cabelo"],
                ["rosto", "Rosto & Expressão"],
                ["roupa", "Roupa & Itens"],
                ["neuro", "Neurodivergência (∞)"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className="min-h-[40px] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: tab === key ? "var(--accent-emerald)" : "var(--bg-surface)",
                  color: tab === key ? "#FAF7F2" : "var(--text-primary)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "cabeca" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Estilo de Cabelo / Cabeça"
                value={config.top}
                options={AVATAR_OPTIONS.top}
                onChange={(v) => onChange({ ...config, top: v })}
              />
              <SelectField
                label="Cor do Cabelo"
                value={config.hairColor}
                options={AVATAR_OPTIONS.hairColor}
                onChange={(v) => onChange({ ...config, hairColor: v })}
              />
              <SelectField
                label="Tom de Pele"
                value={config.skinColor}
                options={AVATAR_OPTIONS.skinColor}
                onChange={(v) => onChange({ ...config, skinColor: v })}
              />
              <SelectField
                label="Cor do Fundo"
                value={config.backgroundColor}
                options={AVATAR_OPTIONS.backgroundColor}
                onChange={(v) => onChange({ ...config, backgroundColor: v })}
              />
            </div>
          )}

          {tab === "rosto" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Olhos"
                value={config.eyes}
                options={AVATAR_OPTIONS.eyes}
                onChange={(v) => onChange({ ...config, eyes: v })}
              />
              <SelectField
                label="Sobrancelhas"
                value={config.eyebrows}
                options={AVATAR_OPTIONS.eyebrows}
                onChange={(v) => onChange({ ...config, eyebrows: v })}
              />
              <SelectField
                label="Expressão / Boca"
                value={config.mouth}
                options={AVATAR_OPTIONS.mouth}
                onChange={(v) => onChange({ ...config, mouth: v })}
              />
            </div>
          )}

          {tab === "roupa" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Óculos / Acessórios"
                value={config.accessories}
                options={AVATAR_OPTIONS.accessories}
                onChange={(v) => onChange({ ...config, accessories: v })}
              />
              <SelectField
                label="Roupa"
                value={config.clothing}
                options={AVATAR_OPTIONS.clothing}
                onChange={(v) => onChange({ ...config, clothing: v })}
              />
              <SelectField
                label="Cor da Roupa"
                value={config.clothesColor}
                options={AVATAR_OPTIONS.clothesColor}
                onChange={(v) => onChange({ ...config, clothesColor: v })}
              />
            </div>
          )}

          {tab === "neuro" && (
            <div className="space-y-3">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Marque uma ou mais identificações ou afinidades. Elas moldam a aura visual (∞) do seu avatar nas
                publicações da comunidade:
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {NEURODIVERGENCE_BADGES.map((badge) => {
                  const selected = neurodivergences.includes(badge.id);
                  return (
                    <button
                      key={badge.id}
                      type="button"
                      onClick={() => toggleNeuro(badge.id)}
                      className="flex items-start gap-3 rounded-xl border p-3 text-left transition-all"
                      style={{
                        borderColor: selected ? badge.color : "var(--border-subtle)",
                        backgroundColor: selected ? "var(--bg-surface)" : "transparent",
                      }}
                    >
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: badge.color }}
                      >
                        ∞
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{badge.label}</span>
                        <span className="block text-xs" style={{ color: "var(--text-muted)" }}>
                          {badge.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[44px] rounded-xl border px-3 py-2 text-sm"
        style={{
          backgroundColor: "var(--bg-canvas)",
          borderColor: "var(--border-subtle)",
          color: "var(--text-primary)",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
