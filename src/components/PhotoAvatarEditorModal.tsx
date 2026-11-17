"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Upload, ZoomIn, RotateCw, Sparkles, Sliders, X, Check, RotateCcw } from "lucide-react";

interface FilterPreset {
  id: string;
  label: string;
  filter: string;
}

const FILTER_PRESETS: FilterPreset[] = [
  { id: "original", label: "Original", filter: "none" },
  { id: "editorial", label: "Editorial", filter: "contrast(1.08) saturate(0.94) brightness(1.03)" },
  { id: "vivido", label: "Vívido", filter: "contrast(1.12) saturate(1.28) brightness(1.04)" },
  { id: "pb", label: "P&B Clássico", filter: "grayscale(1) contrast(1.18) brightness(1.04)" },
  { id: "suave", label: "Suave", filter: "contrast(0.94) saturate(1.06) brightness(1.08)" },
  { id: "esmeralda", label: "Esmeralda", filter: "contrast(1.06) saturate(1.08) hue-rotate(-8deg)" },
];

export function PhotoAvatarEditorModal({
  initialPhoto,
  onSave,
  onClose,
}: {
  initialPhoto?: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [imageSrc, setImageSrc] = useState<string>(initialPhoto || "");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const [preset, setPreset] = useState<string>("original");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const buildFilterString = useCallback(() => {
    const base = FILTER_PRESETS.find((p) => p.id === preset)?.filter || "none";
    const fine = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    return base === "none" ? fine : `${base} ${fine}`;
  }, [preset, brightness, contrast, saturation]);

  // Load image into HTMLImageElement whenever imageSrc changes
  useEffect(() => {
    if (!imageSrc) {
      setImgLoaded(false);
      imgRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const drawCanvas = useCallback(
    (targetCanvas: HTMLCanvasElement, size: number, withGuide: boolean) => {
      const ctx = targetCanvas.getContext("2d");
      const img = imgRef.current;
      if (!ctx || !img) return;

      targetCanvas.width = size;
      targetCanvas.height = size;
      ctx.clearRect(0, 0, size, size);

      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = "#191B1C";
      ctx.fillRect(0, 0, size, size);

      ctx.filter = buildFilterString();

      const scaleBase = Math.max(size / img.width, size / img.height);
      const totalScale = scaleBase * zoom;

      ctx.translate(size / 2 + (offset.x * size) / 280, size / 2 + (offset.y * size) / 280);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(totalScale, totalScale);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      if (withGuide && dragging) {
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.38)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(size / 3, 0);
        ctx.lineTo(size / 3, size);
        ctx.moveTo((size * 2) / 3, 0);
        ctx.lineTo((size * 2) / 3, size);
        ctx.moveTo(0, size / 3);
        ctx.lineTo(size, size / 3);
        ctx.moveTo(0, (size * 2) / 3);
        ctx.lineTo(size, (size * 2) / 3);
        ctx.stroke();
        ctx.restore();
      }
    },
    [buildFilterString, zoom, offset, rotation, dragging]
  );

  useEffect(() => {
    if (imgLoaded && canvasRef.current) {
      drawCanvas(canvasRef.current, 280, true);
    }
  }, [imgLoaded, drawCanvas]);

  const handleFile = (file?: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageSrc(reader.result);
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
        setPreset("original");
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!imgLoaded) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const maxOffset = 140 * zoom;
    setOffset({
      x: Math.max(-maxOffset, Math.min(maxOffset, dragStart.current.ox + dx)),
      y: Math.max(-maxOffset, Math.min(maxOffset, dragStart.current.oy + dy)),
    });
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const resetAll = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setPreset("original");
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const handleSave = () => {
    if (!imgLoaded) return;
    setSaving(true);
    try {
      const out = document.createElement("canvas");
      drawCanvas(out, 512, false);
      let dataUrl = out.toDataURL("image/webp", 0.85);
      if (!dataUrl.startsWith("data:image/webp")) {
        dataUrl = out.toDataURL("image/jpeg", 0.86);
      }
      onSave(dataUrl);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="flex w-full sm:max-w-2xl max-h-[92vh] flex-col rounded-t-2xl sm:rounded-2xl border shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-3.5"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div>
            <h3 className="font-display text-base sm:text-lg font-semibold">Estúdio de Foto do Perfil</h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Arraste para enquadrar, dê zoom e escolha um acabamento editorial.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-black/5"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {!imageSrc ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors"
              style={{
                borderColor: dragOver ? "var(--accent-emerald)" : "var(--border-subtle)",
                backgroundColor: dragOver ? "rgba(24, 73, 45, 0.06)" : "var(--bg-surface)",
              }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "var(--accent-emerald)" }}
              >
                <Upload className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="font-display text-base font-semibold">Envie ou arraste sua foto</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  JPG, PNG ou WebP · Processamento instantâneo no dispositivo
                </p>
              </div>
              <span className="btn-primary mt-1 inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold">
                Escolher da galeria / arquivo
              </span>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[290px_1fr] md:items-start">
              {/* Circular Interactive Cropper */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative rounded-full p-1 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #18492D, #BD4626)",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={280}
                    height={280}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className="h-[240px] w-[240px] sm:h-[260px] sm:w-[260px] cursor-grab active:cursor-grabbing rounded-full touch-none bg-black/90"
                  />
                </div>

                {/* Quick Zoom & Rotate controls */}
                <div className="flex w-full max-w-[260px] items-center gap-2">
                  <ZoomIn className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.02}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    aria-label="Zoom"
                    className="flex-1 accent-[#18492D]"
                  />
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    title="Girar 90°"
                    aria-label="Girar 90 graus"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border hover:bg-black/5"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={resetAll}
                    title="Resetar ajustes"
                    aria-label="Resetar ajustes"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border hover:bg-black/5"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold underline"
                  style={{ color: "var(--accent-emerald)" }}
                >
                  Trocar imagem
                </button>
              </div>

              {/* Filters & Fine Adjustments */}
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
                      <Sparkles className="h-3.5 w-3.5" /> Filtros
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAdjustments((v) => !v)}
                      className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>{showAdjustments ? "Ocultar ajustes" : "Ajuste fino"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {FILTER_PRESETS.map((p) => {
                      const active = preset === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPreset(p.id)}
                          className="flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-all"
                          style={{
                            borderColor: active ? "var(--accent-emerald)" : "var(--border-subtle)",
                            backgroundColor: active ? "rgba(24, 73, 45, 0.08)" : "var(--bg-surface)",
                          }}
                        >
                          <img
                            src={imageSrc}
                            alt=""
                            className="h-11 w-11 rounded-full object-cover"
                            style={{ filter: p.filter }}
                          />
                          <span className="text-[11px] font-semibold leading-tight">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {showAdjustments && (
                  <div
                    className="space-y-3 rounded-xl border p-3.5"
                    style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
                  >
                    <label className="block space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="font-medium">Brilho</span>
                        <span className="font-mono-num">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min={70}
                        max={135}
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-[#18492D]"
                      />
                    </label>
                    <label className="block space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="font-medium">Contraste</span>
                        <span className="font-mono-num">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min={75}
                        max={140}
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-[#18492D]"
                      />
                    </label>
                    <label className="block space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="font-medium">Saturação</span>
                        <span className="font-mono-num">{saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={160}
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full accent-[#18492D]"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 border-t px-5 py-3.5"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary min-h-[40px] rounded-md px-4 text-xs sm:text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!imgLoaded || saving}
            onClick={handleSave}
            className="btn-primary inline-flex min-h-[40px] items-center gap-1.5 rounded-md px-5 text-xs sm:text-sm font-semibold disabled:opacity-40"
          >
            <Check className="h-4 w-4" />
            <span>{saving ? "Aplicando..." : "Usar esta foto"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
