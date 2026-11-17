"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Heart, MessageCircle, CheckCheck } from "lucide-react";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import type { AvatarConfig } from "@/lib/avatar";

export interface NotificationItem {
  id: string;
  actor_name: string;
  actor_avatar: Partial<AvatarConfig> | null;
  type: "like" | "comment" | string;
  submission_id: string;
  submission_title: string;
  comment_preview: string;
  is_read: boolean;
  created_at: string;
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

export function NotificationBell({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(Number(data.unreadCount || 0));
    } catch {
      // silent
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 45000);
    const onFocus = () => fetchNotifications();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [enabled, fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  if (!enabled) return null;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    }).catch(() => {});
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    setOpen(false);
    if (!item.is_read) {
      setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
      fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: item.id }),
      }).catch(() => {});
    }
    router.push(`/comunidade?post=${encodeURIComponent(item.submission_id)}`);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) fetchNotifications();
        }}
        aria-label="Notificações"
        title="Notificações de curtidas e comentários"
        className="relative flex min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] items-center justify-center rounded border transition-colors hover:bg-black/5"
        style={{
          borderColor: open ? "var(--accent-emerald)" : "var(--border-subtle)",
          color: "var(--text-primary)",
        }}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-sm"
            style={{ backgroundColor: "#BD4626" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-[320px] sm:w-[360px] rounded-xl border shadow-xl z-50 overflow-hidden"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <span className="font-display text-sm font-semibold">Notificações</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
                style={{ color: "var(--accent-emerald)" }}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Marcar lidas</span>
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y" style={{ borderColor: "var(--border-subtle)" }}>
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                Nenhuma notificação ainda. Quando alguém curtir ou comentar uma publicação sua, aparece aqui.
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleNotificationClick(n)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-black/5"
                  style={{
                    backgroundColor: n.is_read ? "transparent" : "rgba(24, 73, 45, 0.05)",
                  }}
                >
                  <div className="relative shrink-0">
                    <AvatarDisplay config={n.actor_avatar} size={36} showBadges={false} />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white"
                      style={{
                        backgroundColor: n.type === "like" ? "#BD4626" : "var(--accent-emerald)",
                      }}
                    >
                      {n.type === "like" ? (
                        <Heart className="h-2.5 w-2.5 fill-current" />
                      ) : (
                        <MessageCircle className="h-2.5 w-2.5 fill-current" />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs leading-snug" style={{ color: "var(--text-primary)" }}>
                      <strong>{n.actor_name}</strong>{" "}
                      {n.type === "like" ? "curtiu sua publicação" : "comentou na sua publicação"}{" "}
                      {n.submission_title && <span className="font-semibold">“{n.submission_title}”</span>}
                    </p>
                    {n.comment_preview && (
                      <p className="truncate text-[11px]" style={{ color: "var(--text-secondary)" }}>
                        “{n.comment_preview}”
                      </p>
                    )}
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {formatRelativeTime(n.created_at)}
                    </p>
                  </div>
                  {!n.is_read && (
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--accent-emerald)" }}
                    />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
