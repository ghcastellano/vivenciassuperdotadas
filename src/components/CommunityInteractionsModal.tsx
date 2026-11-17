"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Pencil, Trash2, X, Check, Send } from "lucide-react";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import type { AvatarConfig } from "@/lib/avatar";

export interface LikeUserItem {
  user_id: string;
  user_name: string;
  user_avatar: Partial<AvatarConfig> | null;
  created_at: string;
}

export interface CommentItem {
  id: string;
  submission_id: string;
  user_id: string;
  user_name: string;
  user_avatar: Partial<AvatarConfig> | null;
  content: string;
  created_at: string;
  updated_at: string | null;
}

function formatRelativeTime(iso: string): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return "agora";
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function CommunityInteractionsModal({
  submissionId,
  submissionTitle,
  authorName,
  initialTab,
  isLoggedIn,
  currentUserId,
  currentUserName,
  isAdmin,
  likedByMe,
  onToggleLike,
  onCountsChange,
  onClose,
}: {
  submissionId: string;
  submissionTitle: string;
  authorName: string;
  initialTab: "comments" | "likes";
  isLoggedIn: boolean;
  currentUserId: string | null;
  currentUserName: string;
  isAdmin: boolean;
  likedByMe: boolean;
  onToggleLike: () => void;
  onCountsChange: (submissionId: string, likesCount: number, commentsCount: number) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"comments" | "likes">(initialTab);
  const [likes, setLikes] = useState<LikeUserItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/community/interactions?submissionId=${encodeURIComponent(submissionId)}`, {
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : { likes: [], comments: [] }))
      .then((data) => {
        if (!active) return;
        const l = Array.isArray(data.likes) ? data.likes : [];
        const c = Array.isArray(data.comments) ? data.comments : [];
        setLikes(l);
        setComments(c);
        onCountsChange(submissionId, l.length, c.length);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [submissionId, onCountsChange]);

  const handleModalLikeToggle = () => {
    if (isLoggedIn && currentUserId) {
      const nextLikes = likedByMe
        ? likes.filter((l) => l.user_id !== currentUserId)
        : [
            {
              user_id: currentUserId,
              user_name: currentUserName,
              user_avatar: null,
              created_at: new Date().toISOString(),
            },
            ...likes.filter((l) => l.user_id !== currentUserId),
          ];
      setLikes(nextLikes);
    }
    onToggleLike();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || submitting) return;
    setError("");
    const tempId = `temp-${Date.now()}`;
    const optimistic: CommentItem = {
      id: tempId,
      submission_id: submissionId,
      user_id: currentUserId || "me",
      user_name: currentUserName,
      user_avatar: null,
      content,
      created_at: new Date().toISOString(),
      updated_at: null,
    };
    const optimisticList = [...comments, optimistic];
    setComments(optimisticList);
    setDraft("");
    onCountsChange(submissionId, likes.length, optimisticList.length);
    setSubmitting(true);

    try {
      const res = await fetch("/api/community/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_comment", submissionId, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível comentar.");
        setComments((prev) => {
          const rolledBack = prev.filter((c) => c.id !== tempId);
          onCountsChange(submissionId, likes.length, rolledBack.length);
          return rolledBack;
        });
      } else if (data.comment) {
        setComments((prev) => prev.map((c) => (c.id === tempId ? data.comment : c)));
        window.dispatchEvent(new Event("vs:notifications-updated"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const saveEdit = async (commentId: string) => {
    const content = editDraft.trim();
    if (!content) return;
    setError("");
    const prevComments = comments;
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, content, updated_at: new Date().toISOString() } : c))
    );
    setEditingId(null);
    setEditDraft("");

    const res = await fetch("/api/community/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "edit_comment", commentId, content }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Não foi possível editar.");
      setComments(prevComments);
      return;
    }
    if (data.comment) {
      setComments((prev) => prev.map((c) => (c.id === commentId ? data.comment : c)));
    }
  };

  const deleteComment = async (commentId: string) => {
    setError("");
    const prevComments = comments;
    const next = comments.filter((c) => c.id !== commentId);
    setComments(next);
    onCountsChange(submissionId, likes.length, next.length);

    const res = await fetch("/api/community/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_comment", commentId }),
    });
    if (!res.ok) {
      setComments(prevComments);
      onCountsChange(submissionId, likes.length, prevComments.length);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex w-full sm:max-w-lg max-h-[85vh] flex-col rounded-t-2xl sm:rounded-2xl border shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-3.5"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="min-w-0 pr-3">
            <p className="truncate font-display text-base font-semibold">{submissionTitle}</p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              por {authorName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-black/5"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs (Comentários / Curtidas) */}
        <div
          className="flex items-center justify-between border-b px-5 py-2 text-xs font-semibold"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("comments")}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors"
              style={{
                backgroundColor: tab === "comments" ? "var(--bg-card)" : "transparent",
                color: tab === "comments" ? "var(--accent-emerald)" : "var(--text-secondary)",
              }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Comentários ({comments.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("likes")}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors"
              style={{
                backgroundColor: tab === "likes" ? "var(--bg-card)" : "transparent",
                color: tab === "likes" ? "#BD4626" : "var(--text-secondary)",
              }}
            >
              <Heart className={`h-3.5 w-3.5 ${likedByMe ? "fill-current" : ""}`} />
              <span>Curtidas ({likes.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleModalLikeToggle}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-transform active:scale-95"
            style={{ color: likedByMe ? "#BD4626" : "var(--text-secondary)" }}
          >
            <Heart className={`h-4 w-4 ${likedByMe ? "fill-current" : ""}`} />
            <span>{likedByMe ? "Curtiu" : "Curtir"}</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {loading ? (
            <p className="py-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
              Carregando...
            </p>
          ) : tab === "likes" ? (
            likes.length === 0 ? (
              <p className="py-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                Nenhuma curtida ainda. Seja a primeira pessoa a curtir!
              </p>
            ) : (
              <ul className="space-y-3">
                {likes.map((l) => (
                  <li key={l.user_id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <AvatarDisplay config={l.user_avatar} size={36} showBadges={false} />
                      <span className="truncate text-sm font-semibold">{l.user_name}</span>
                    </div>
                    <Heart className="h-4 w-4 shrink-0 fill-current" style={{ color: "#BD4626" }} />
                  </li>
                ))}
              </ul>
            )
          ) : comments.length === 0 ? (
            <p className="py-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
              Nenhum comentário ainda. Inicie a conversa abaixo!
            </p>
          ) : (
            <ul className="space-y-4">
              {comments.map((c) => {
                const canModify = currentUserId && (c.user_id === currentUserId || isAdmin);
                const isEditing = editingId === c.id;
                return (
                  <li key={c.id} className="flex items-start gap-3">
                    <AvatarDisplay config={c.user_avatar} size={34} showBadges={false} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate text-xs font-semibold">{c.user_name}</span>
                          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                            {formatRelativeTime(c.created_at)}
                            {c.updated_at ? " · editado" : ""}
                          </span>
                        </div>
                        {canModify && !isEditing && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {c.user_id === currentUserId && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(c.id);
                                  setEditDraft(c.content);
                                }}
                                aria-label="Editar comentário"
                                className="p-1 rounded hover:bg-black/5"
                                style={{ color: "var(--text-muted)" }}
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteComment(c.id)}
                              aria-label="Excluir comentário"
                              className="p-1 rounded hover:bg-black/5"
                              style={{ color: "#BD4626" }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="mt-1.5 flex items-center gap-2">
                          <input
                            value={editDraft}
                            onChange={(e) => setEditDraft(e.target.value)}
                            maxLength={1000}
                            className="flex-1 min-h-[34px] rounded-lg border px-2.5 text-xs"
                            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
                          />
                          <button
                            type="button"
                            onClick={() => saveEdit(c.id)}
                            aria-label="Salvar edição"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: "var(--accent-emerald)" }}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditDraft("");
                            }}
                            aria-label="Cancelar edição"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border"
                            style={{ borderColor: "var(--border-subtle)" }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <p
                          className="mt-0.5 text-sm leading-relaxed break-words [overflow-wrap:anywhere]"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {c.content}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer input */}
        <div className="border-t px-4 py-3" style={{ borderColor: "var(--border-subtle)" }}>
          {error && (
            <p className="mb-2 text-xs font-medium" style={{ color: "var(--accent-crimson)" }}>
              {error}
            </p>
          )}
          {isLoggedIn ? (
            <form onSubmit={addComment} className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Adicione um comentário..."
                maxLength={1000}
                className="flex-1 min-h-[40px] rounded-full border px-4 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
              <button
                type="submit"
                disabled={submitting || !draft.trim()}
                aria-label="Publicar comentário"
                className="btn-primary inline-flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-2 text-xs">
              <span style={{ color: "var(--text-muted)" }}>Entre na sua conta para curtir ou comentar.</span>
              <Link href="/entrar" className="font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
                Entrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
