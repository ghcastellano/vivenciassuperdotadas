"use client";

import React, { useState } from "react";
import { Shuffle, Download, Share2, Check, MessageCircle, Camera, Sparkles, Info } from "lucide-react";
import {
  AVATAR_OPTIONS,
  NEURODIVERGENCE_BADGES,
  isSafeAvatarDataUrl,
  renderShareableAvatarSvg,
  type AvatarConfig,
  type NeurodivergenceId,
} from "@/lib/avatar";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { PhotoAvatarEditorModal } from "@/components/PhotoAvatarEditorModal";

const LANYARD_INFO: Record<string, string> = {
  sunflowerLanyard:
    "Cordão de Girassol: símbolo internacional para deficiências ocultas e condições previstas na legislação PcD (Lei nº 14.624/2023), indicando necessidade de compreensão ou atendimento prioritário.",
  infinityLanyard:
    "Cordão do Infinito: representa a neurodiversidade de forma ampla (AH/SD, TDAH, TEA, Dislexia e outras variações neurocognitivas).",
  puzzleLanyard:
    "Cordão Quebra-Cabeça: símbolo tradicional historicamente associado ao Transtorno do Espectro Autista (TEA).",
  noiseHeadphones:
    "Abafador de Ruídos: recurso de regulação sensorial utilizado para reduzir sobrecarga auditiva em ambientes intensos.",
};

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
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const isPhotoMode = config.mode === "photo" && isSafeAvatarDataUrl(config.customPhoto);

  const randomize = () => {
    onChange({
      ...config,
      mode: "avatar",
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

  const renderPngBlob = async (): Promise<Blob> => {
    const svg = renderShareableAvatarSvg(config, neurodivergences, personName);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Erro ao renderizar imagem do avatar."));
      img.src = dataUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1260;
    canvas.height = 1410;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas não disponível.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar PNG."))), "image/png", 1);
    });
  };

  const downloadPng = async () => {
    const blob = await renderPngBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avatar-vivencias-${personName.toLowerCase().replace(/\s+/g, "-") || "unico"}.png`;
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
      const pngBlob = await renderPngBlob();
      const file = new File([pngBlob], "meu-avatar-vivencias.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({
          title: `Avatar Único — ${personName} | Vivências Superdotadas`,
          text: manifesto || "Cada pessoa é única. Conheça meu avatar na Associação Vivências Superdotadas!",
          files: [file],
        });
        return;
      }
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
            {/* Mode switch: Avatar Ilustrado vs Minha Foto */}
            <div
              className="grid grid-cols-2 gap-1 rounded-xl border p-1"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            >
              <button
                type="button"
                onClick={() => onChange({ ...config, mode: "avatar" })}
                className="flex min-h-[34px] items-center justify-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold transition-colors"
                style={{
                  backgroundColor: !isPhotoMode ? "var(--accent-emerald)" : "transparent",
                  color: !isPhotoMode ? "#FFFFFF" : "var(--text-secondary)",
                }}
              >
                <Sparkles className="h-3 w-3" />
                <span>Avatar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isSafeAvatarDataUrl(config.customPhoto)) {
                    onChange({ ...config, mode: "photo" });
                  } else {
                    setPhotoModalOpen(true);
                  }
                }}
                className="flex min-h-[34px] items-center justify-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold transition-colors"
                style={{
                  backgroundColor: isPhotoMode ? "var(--accent-emerald)" : "transparent",
                  color: isPhotoMode ? "#FFFFFF" : "var(--text-secondary)",
                }}
              >
                <Camera className="h-3 w-3" />
                <span>Minha Foto</span>
              </button>
            </div>

            {isPhotoMode ? (
              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                className="flex min-h-[42px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              >
                <Camera className="h-3.5 w-3.5" />
                Editar ou trocar foto
              </button>
            ) : (
              <button
                type="button"
                onClick={randomize}
                className="flex min-h-[42px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              >
                <Shuffle className="h-3.5 w-3.5" />
                Gerar combinação aleatória
              </button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={downloadPng}
                className="flex min-h-[40px] items-center justify-center gap-1.5 rounded border px-2 py-1.5 text-xs font-medium"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              >
                <Download className="h-3.5 w-3.5" />
                Baixar PNG
              </button>
              <button
                type="button"
                onClick={shareAvatar}
                className="flex min-h-[40px] items-center justify-center gap-1.5 rounded border px-2 py-1.5 text-xs font-medium"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? "Copiado!" : "Compartilhar"}
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
              <SelectField
                label="Barba / Bigode / Cavanhaque"
                value={config.facialHair || "none"}
                options={AVATAR_OPTIONS.facialHair}
                onChange={(v) => onChange({ ...config, facialHair: v })}
              />
              <SelectField
                label="Cor da Barba / Bigode"
                value={config.facialHairColor || config.hairColor}
                options={AVATAR_OPTIONS.facialHairColor}
                onChange={(v) => onChange({ ...config, facialHairColor: v })}
              />
              <SelectField
                label="Marca / Tatuagem na Testa"
                value={config.foreheadMark || "none"}
                options={AVATAR_OPTIONS.foreheadMark}
                onChange={(v) => onChange({ ...config, foreheadMark: v })}
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
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Cordão / Acessório Sensorial
                  </span>
                  <span
                    title="Passe ou selecione para ver o significado de cada cordão"
                    className="inline-flex items-center text-[var(--accent-emerald)]"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </div>
                <SelectField
                  label=""
                  value={config.neuroAccessory || "none"}
                  options={AVATAR_OPTIONS.neuroAccessory}
                  onChange={(v) => onChange({ ...config, neuroAccessory: v })}
                />
                {config.neuroAccessory && config.neuroAccessory !== "none" && LANYARD_INFO[config.neuroAccessory] && (
                  <p
                    className="flex items-start gap-2 rounded-xl border p-3 text-xs leading-relaxed"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--accent-emerald)" }} />
                    <span>{LANYARD_INFO[config.neuroAccessory]}</span>
                  </p>
                )}
              </div>
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

      {photoModalOpen && (
        <PhotoAvatarEditorModal
          initialPhoto={isSafeAvatarDataUrl(config.customPhoto) ? config.customPhoto : undefined}
          onSave={(dataUrl) => {
            onChange({ ...config, mode: "photo", customPhoto: dataUrl });
            setPhotoModalOpen(false);
          }}
          onClose={() => setPhotoModalOpen(false)}
        />
      )}
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
