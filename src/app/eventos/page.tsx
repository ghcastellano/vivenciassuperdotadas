"use client";

import React, { useEffect, useState } from "react";
import { Calendar, ExternalLink, MapPin } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  format: string;
  image_url: string;
  event_link: string;
}

export default function EventosPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
      <div className="max-w-3xl space-y-3 border-b pb-8" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-crimson)" }}>
          Agenda Vivências
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Próximos Eventos & Encontros</h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Rodas de conversa, lives e encontros abertos a pessoas AH/SD, familiares, educadores e aliados neurotípicos.
        </p>
      </div>

      {events.length === 0 ? (
        <div
          className="mt-10 rounded-2xl border p-10 text-center"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <Calendar className="mx-auto h-8 w-8" style={{ color: "var(--accent-emerald)" }} />
          <h2 className="mt-3 font-display text-xl font-semibold">Novos encontros em breve</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Os próximos eventos adicionados pela administração aparecerão aqui com imagem e link de inscrição.
            Acompanhe também pelo{" "}
            <a
              href="https://www.instagram.com/vivenciassuperdotadas/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--accent-emerald)" }}
            >
              Instagram @vivenciassuperdotadas
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <article key={ev.id} className="editorial-card overflow-hidden rounded-2xl flex flex-col justify-between">
              <div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-black/5">
                  <img
                    src={ev.image_url || "/images/logo-vivencias.jpg"}
                    alt={ev.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="font-mono-num">
                      {new Date(ev.event_date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {ev.format}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-xl font-semibold">{ev.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {ev.description}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5">
                <a
                  href={ev.event_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  <span>Acessar / Inscrever-se</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
