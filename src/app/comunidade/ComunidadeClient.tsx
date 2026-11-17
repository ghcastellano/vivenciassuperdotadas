"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Link2, MessageSquareQuote, MessageCircle, ExternalLink, CheckCircle2, Users, Heart } from "lucide-react";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import type { AvatarConfig } from "@/lib/avatar";
import { ImageCurtainReveal } from "@/components/EditorialEffects";
import {
  CommunityInteractionsModal,
  type CommentItem,
  type LikeUserItem,
} from "@/components/CommunityInteractionsModal";

export interface MemberAvatarCard {
  id: string;
  avatar_config: Partial<AvatarConfig> | null;
  neurodivergences: string[];
}

export interface CommunitySubmissionItem {
  id: string;
  author_name: string;
  author_avatar: Partial<AvatarConfig> | null;
  author_neurodivergences: string[];
  kind: string;
  title: string;
  content: string;
  external_url: string;
  image_url: string;
  credits: string;
  created_at: string;
  isMock?: boolean;
}

export function ComunidadeClient({
  initialSubmissions,
  initialMembers = [],
  activeMembersCount = 0,
  initialInteractions = {},
}: {
  initialSubmissions: CommunitySubmissionItem[];
  initialMembers?: MemberAvatarCard[];
  activeMembersCount?: number;
  initialInteractions?: Record<string, { likes: LikeUserItem[]; comments: CommentItem[] }>;
}) {
  const { data: session } = useSession();
  const [submissions] = useState<CommunitySubmissionItem[]>(initialSubmissions);
  const [kindFilter, setKindFilter] = useState("todos");
  const [showAllAvatars, setShowAllAvatars] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [interactionsMap, setInteractionsMap] =
    useState<Record<string, { likes: LikeUserItem[]; comments: CommentItem[] }>>(initialInteractions);
  const [counts, setCounts] = useState<Record<string, { likes: number; comments: number }>>(() => {
    const map: Record<string, { likes: number; comments: number }> = {};
    for (const [subId, entry] of Object.entries(initialInteractions)) {
      map[subId] = { likes: entry.likes.length, comments: entry.comments.length };
    }
    return map;
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    submission: CommunitySubmissionItem;
    tab: "comments" | "likes";
  } | null>(null);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    kind: "relato",
    title: "",
    content: "",
    externalUrl: "",
    imageUrl: "",
    credits: "",
  });

  useEffect(() => {
    fetch("/api/community/interactions?summary=1", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.currentUserId) setCurrentUserId(data.currentUserId);
        if (Array.isArray(data.likedIds)) setLikedIds(new Set(data.likedIds));
        if (data.counts) setCounts(data.counts);
      })
      .catch(() => {});
  }, [session?.user?.email]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const postParam = new URLSearchParams(window.location.search).get("post");
    if (!postParam) return;
    const target = submissions.find((s) => s.id === postParam);
    if (!target) return;
    setKindFilter("todos");
    setHighlightedPostId(target.id);
    setModalState({ submission: target, tab: "comments" });
    setTimeout(() => {
      document.getElementById(`post-${target.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  }, [submissions]);

  const handleCountsChange = useCallback((submissionId: string, likesCount: number, commentsCount: number) => {
    setCounts((prev) => ({
      ...prev,
      [submissionId]: { likes: likesCount, comments: commentsCount },
    }));
  }, []);

  const handleInteractionsSync = useCallback(
    (submissionId: string, likes: LikeUserItem[], comments: CommentItem[]) => {
      setInteractionsMap((prev) => ({
        ...prev,
        [submissionId]: { likes, comments },
      }));
    },
    []
  );

  const toggleLike = async (submission: CommunitySubmissionItem) => {
    if (!session?.user) {
      setModalState({ submission, tab: "likes" });
      return;
    }
    const wasLiked = likedIds.has(submission.id);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(submission.id);
      else next.add(submission.id);
      return next;
    });
    setCounts((prev) => {
      const curr = prev[submission.id] || { likes: 0, comments: 0 };
      return {
        ...prev,
        [submission.id]: { ...curr, likes: Math.max(0, curr.likes + (wasLiked ? -1 : 1)) },
      };
    });

    const res = await fetch("/api/community/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_like", submissionId: submission.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (data.likedByMe) next.add(submission.id);
        else next.delete(submission.id);
        return next;
      });
      setCounts((prev) => ({
        ...prev,
        [submission.id]: {
          likes: Number(data.likesCount ?? 0),
          comments: prev[submission.id]?.comments ?? 0,
        },
      }));
      window.dispatchEvent(new Event("vs:notifications-updated"));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro ao enviar.");
      return;
    }
    setMessage("Enviado com sucesso! Sua publicação entrará no ar após aprovação dos administradores.");
    setForm({ kind: "relato", title: "", content: "", externalUrl: "", imageUrl: "", credits: "" });
    setFormOpen(false);
  };

  const filtered = kindFilter === "todos" ? submissions : submissions.filter((s) => s.kind === kindFilter);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
      <div
        className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
            Voz em Primeira Pessoa & Criações
          </p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Comunidade Vivências</h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Espaço para artes, criações, links de conhecimento e relatos em primeira pessoa. Cada publicação traz o
            Avatar Único e as marcas de neurodivergência de quem a criou.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            <MessageCircle className="h-4 w-4" style={{ color: "var(--accent-emerald)" }} />
            <span>Grupo WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="btn-primary min-h-[44px] rounded-md px-5 py-2.5 text-sm font-semibold"
          >
            {formOpen ? "Fechar envio" : "Enviar arte, link ou relato"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className="mt-6 flex items-center gap-2 rounded-2xl border p-4 text-sm"
          style={{ borderColor: "var(--accent-emerald)", backgroundColor: "var(--bg-surface)" }}
        >
          <CheckCircle2 className="h-5 w-5" style={{ color: "var(--accent-emerald)" }} />
          <span>{message}</span>
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={submit}
          className="mt-8 space-y-4 rounded-2xl border p-6"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold">Nova contribuição (moderada pelos admins)</h2>
            <Link href="/entrar" className="text-xs font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
              Precisa estar logado(a) · Entrar com Google ou E-mail
            </Link>
          </div>

          {error && (
            <p className="text-sm font-semibold" style={{ color: "var(--accent-crimson)" }}>
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            >
              <option value="relato">Relato em Primeira Pessoa (Vivência)</option>
              <option value="arte">Arte ou Criação</option>
              <option value="link">Link de Conhecimento</option>
            </select>
            <input
              required
              placeholder="Título da publicação"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <input
              placeholder="Link externo (opcional — para links de conhecimento ou portfólio)"
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <input
              placeholder="URL de imagem (opcional — para artes e criações)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
          </div>

          <textarea
            required
            rows={4}
            placeholder="Escreva seu relato, descrição da arte ou resumo do link de conhecimento..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full rounded-xl border p-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
          />
          <input
            placeholder="Créditos / Referência da fonte (opcional)"
            value={form.credits}
            onChange={(e) => setForm({ ...form, credits: e.target.value })}
            className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
          />
          <button type="submit" className="btn-primary min-h-[44px] rounded-md px-6 py-2.5 text-sm font-semibold">
            Enviar para moderação
          </button>
        </form>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["todos", "Tudo"],
            ["relato", "Relatos em 1ª Pessoa"],
            ["arte", "Artes & Criações"],
            ["link", "Links de Conhecimento"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKindFilter(k)}
            className="min-h-[40px] rounded-md border px-3.5 py-1.5 text-xs sm:text-sm font-semibold"
            style={{
              backgroundColor: kindFilter === k ? "var(--accent-emerald)" : "var(--bg-card)",
              color: kindFilter === k ? "#FFFFFF" : "var(--text-primary)",
              borderColor: kindFilter === k ? "var(--accent-emerald)" : "var(--border-subtle)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="mt-6 rounded-2xl border p-8 text-center text-sm"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          Nenhuma publicação aprovada nesta categoria ainda. Seja a primeira pessoa associada a compartilhar um relato, arte ou link de conhecimento!
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => {
          const postCounts = counts[s.id] || { likes: 0, comments: 0 };
          const isLiked = likedIds.has(s.id);
          const isHighlighted = highlightedPostId === s.id;
          return (
          <article
            key={s.id}
            id={`post-${s.id}`}
            className={`editorial-card min-w-0 rounded-2xl p-5 flex flex-col justify-between transition-shadow ${
              isHighlighted ? "ring-2 ring-[#18492D]" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
                <AvatarDisplay
                  config={s.author_avatar}
                  neurodivergences={s.author_neurodivergences}
                  size={48}
                  showBadges={false}
                />
                <div>
                  <p className="text-sm font-semibold">{s.author_name}</p>
                  <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
                    {s.kind === "arte" ? "Arte / Criação" : s.kind === "link" ? "Conhecimento" : "1ª Pessoa"}
                  </p>
                </div>
              </div>

              {s.image_url && (
                <div className="mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl">
                  <ImageCurtainReveal src={s.image_url} alt={s.title} className="h-full w-full object-cover" />
                </div>
              )}

              <h2 className="mt-4 font-display text-lg font-semibold flex items-center gap-2 break-words [overflow-wrap:anywhere]">
                {s.kind === "link" ? (
                  <Link2 className="h-4 w-4 shrink-0" />
                ) : (
                  <MessageSquareQuote className="h-4 w-4 shrink-0" />
                )}
                <span className="min-w-0">{s.title}</span>
              </h2>
              <p className="mt-2 text-sm leading-relaxed break-words [overflow-wrap:anywhere]" style={{ color: "var(--text-secondary)" }}>
                {s.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t space-y-2" style={{ borderColor: "var(--border-subtle)" }}>
              {s.credits && (
                <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                  {s.credits}
                </p>
              )}

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleLike(s)}
                      aria-label={isLiked ? "Descurtir" : "Curtir"}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-125 hover:bg-black/5"
                      style={{ color: isLiked ? "#BD4626" : "var(--text-secondary)" }}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalState({ submission: s, tab: "likes" })}
                      aria-label="Ver quem curtiu"
                      className="min-w-[16px] text-xs font-semibold hover:underline"
                      style={{ color: postCounts.likes > 0 ? "var(--text-primary)" : "var(--text-muted)" }}
                    >
                      {postCounts.likes}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalState({ submission: s, tab: "comments" })}
                    aria-label="Abrir comentários"
                    className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-xs font-semibold transition-colors hover:bg-black/5"
                    style={{ color: postCounts.comments > 0 ? "var(--text-primary)" : "var(--text-muted)" }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{postCounts.comments}</span>
                  </button>
                </div>

                {s.external_url && (
                  <a
                    href={s.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold underline"
                    style={{ color: "var(--accent-emerald)" }}
                  >
                    Abrir <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </article>
          );
        })}
        </div>
      )}

      {/* Painel Coletivo da Comunidade — Escalável para 200+ membros com privacidade */}
      {(activeMembersCount > 0 || initialMembers.length > 0) && (
        <section className="mt-16 border-t pt-12" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="editorial-card p-6 sm:p-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-2">
              <p className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
                Rede Ativa · Privacidade Preservada
              </p>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                <span className="font-mono-num" style={{ color: "var(--accent-emerald)" }}>
                  {activeMembersCount}
                </span>{" "}
                {activeMembersCount === 1 ? "pessoa associada ativa" : "pessoas associadas ativas"}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Por privacidade e escala, exibimos apenas a contagem total da comunidade e uma amostra anônima de
                avatares de quem autorizou explicitamente a exibição pública.
              </p>
            </div>

            {initialMembers.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5 max-w-md lg:justify-end">
                {initialMembers.map((m) => (
                  <AvatarDisplay
                    key={m.id}
                    config={m.avatar_config}
                    neurodivergences={m.neurodivergences?.length ? m.neurodivergences : ["ahsd"]}
                    size={52}
                    showBadges={false}
                  />
                ))}
                {activeMembersCount > initialMembers.length && (
                  <span
                    className="inline-flex h-[56px] min-w-[56px] items-center justify-center rounded-full border px-2 font-mono-num text-xs font-semibold"
                    style={{
                      borderColor: "var(--border-subtle)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-primary)",
                    }}
                  >
                    +{activeMembersCount - initialMembers.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      )}
      {modalState && (
        <CommunityInteractionsModal
          submissionId={modalState.submission.id}
          submissionTitle={modalState.submission.title}
          authorName={modalState.submission.author_name}
          initialTab={modalState.tab}
          initialLikes={interactionsMap[modalState.submission.id]?.likes || []}
          initialComments={interactionsMap[modalState.submission.id]?.comments || []}
          isLoggedIn={Boolean(session?.user)}
          currentUserId={currentUserId || ((session?.user as { id?: string } | undefined)?.id ?? null)}
          currentUserName={session?.user?.name || "Você"}
          isAdmin={(session?.user as { role?: string } | undefined)?.role === "admin"}
          likedByMe={likedIds.has(modalState.submission.id)}
          onToggleLike={() => toggleLike(modalState.submission)}
          onCountsChange={handleCountsChange}
          onInteractionsSync={handleInteractionsSync}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}
