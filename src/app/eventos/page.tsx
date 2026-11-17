import { ExternalLink, MapPin } from "lucide-react";
import { isDatabaseConfigured, query } from "@/lib/db";
import { ImageCurtainReveal } from "@/components/EditorialEffects";

export const revalidate = 60;

interface EventItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  format: string;
  image_url: string;
  event_link: string;
}

export default async function EventosPage() {
  let events: EventItem[] = [];

  if (isDatabaseConfigured()) {
    try {
      events = await query<EventItem>(
        `SELECT id, title, description, event_date::text, format, image_url, event_link
         FROM events
         WHERE active = TRUE
         ORDER BY event_date ASC`
      );
    } catch {
      events = [];
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
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
          className="mt-8 rounded-2xl border p-10 text-center text-sm"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          Nenhum evento agendado no momento. Novos encontros, rodas de conversa e lives serão publicados aqui em breve.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <article key={ev.id} className="editorial-card overflow-hidden rounded-2xl flex flex-col justify-between">
              <div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-black/5">
                  <ImageCurtainReveal
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
