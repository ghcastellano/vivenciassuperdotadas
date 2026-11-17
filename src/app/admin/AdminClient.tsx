"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { Shield, Check, X, Trash2, Plus, Users, Stethoscope, Calendar, Receipt, MessageSquare } from "lucide-react";

export interface AdminData {
  readOnly: boolean;
  professionals: {
    id: string;
    name: string;
    email: string;
    registry_code: string;
    specialty: string;
    city_state: string;
    status: string;
  }[];
  submissions: {
    id: string;
    author_name: string;
    kind: string;
    title: string;
    content: string;
    status: string;
  }[];
  events: {
    id: string;
    title: string;
    description?: string;
    event_date: string;
    format: string;
    event_link?: string;
  }[];
  expenses: {
    id: string;
    category: string;
    description: string;
    amount_cents: number;
    reference_date: string;
  }[];
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
  }[];
  memberships: {
    id: string;
    name: string;
    email: string;
    profile: string;
    city_state: string;
    has_medical_report: string;
    manifesto: string;
    membership_status: string;
    member_number: string;
    accepted_at: string;
    created_at: string;
  }[];
  membersCount: number;
}

type AdminTab = "associacoes" | "profissionais" | "comunidade" | "eventos" | "custos" | "admins";

export function AdminClient({ initialData }: { initialData: AdminData }) {
  const [data, setData] = useState<AdminData>(initialData);
  const [tab, setTab] = useState<AdminTab>("profissionais");
  const [actionNotice, setActionNotice] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const [evForm, setEvForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    format: "Online",
    imageUrl: "",
    eventLink: "",
  });

  const [expForm, setExpForm] = useState({
    category: "infraestrutura",
    description: "",
    amountReais: "",
    referenceDate: new Date().toISOString().slice(0, 10),
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin");
    if (res.ok) {
      setData(await res.json());
    }
  }, []);

  const act = async (payload: Record<string, unknown>) => {
    setActionNotice("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === 403) {
      setActionNotice("Modo visualização aberta: entre como administrador para gravar alterações no banco.");
      return;
    }
    await load();
  };

  const pendingProfs = data.professionals.filter((p) => p.status === "pending");
  const approvedProfs = data.professionals.filter((p) => p.status === "approved");
  const pendingSubs = data.submissions.filter((s) => s.status === "pending");
  const pendingMembers = (data.memberships || []).filter((m) => m.membership_status === "pending");

  const mergedAccounts = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; email: string; role: string }>();
    for (const u of data.users || []) {
      map.set(u.email.toLowerCase(), { id: u.id, name: u.name, email: u.email, role: u.role });
    }
    for (const m of data.memberships || []) {
      const key = m.email.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { id: `mem-${m.id}`, name: m.name, email: m.email, role: "member" });
      }
    }
    return Array.from(map.values());
  }, [data.users, data.memberships]);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--border-subtle)" }}>
        <div>
          <p className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
            Gestão da Associação
          </p>
          <h1 className="font-display text-3xl font-semibold">Painel Administrativo</h1>
        </div>
      </div>

      {actionNotice && (
        <p
          role="alert"
          className="rounded-xl border p-3.5 text-sm font-medium"
          style={{ borderColor: "var(--accent-crimson)", color: "var(--accent-crimson)", backgroundColor: "var(--bg-card)" }}
        >
          {actionNotice}
        </p>
      )}

      {/* KPI Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Associados Ativos</span>
            <Users className="h-4 w-4" style={{ color: "var(--accent-emerald)" }} />
          </div>
          <p className="font-mono-num mt-2 text-2xl font-bold">
            {data.membersCount}{" "}
            <span className="text-xs font-normal" style={{ color: "var(--accent-amber)" }}>
              ({pendingMembers.length} pendentes)
            </span>
          </p>
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Profissionais</span>
            <Stethoscope className="h-4 w-4" style={{ color: "var(--accent-emerald)" }} />
          </div>
          <p className="font-mono-num mt-2 text-2xl font-bold">
            {approvedProfs.length}{" "}
            <span className="text-xs font-normal" style={{ color: "var(--accent-amber)" }}>
              ({pendingProfs.length} pendentes)
            </span>
          </p>
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Comunidade</span>
            <MessageSquare className="h-4 w-4" style={{ color: "var(--accent-crimson)" }} />
          </div>
          <p className="font-mono-num mt-2 text-2xl font-bold">
            {data.submissions.length}{" "}
            <span className="text-xs font-normal" style={{ color: "var(--accent-amber)" }}>
              ({pendingSubs.length} pendentes)
            </span>
          </p>
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Eventos & Custos</span>
            <Calendar className="h-4 w-4" style={{ color: "var(--accent-amber)" }} />
          </div>
          <p className="font-mono-num mt-2 text-2xl font-bold">
            {data.events.length} <span className="text-xs font-normal">eventos</span> · {data.expenses.length}{" "}
            <span className="text-xs font-normal">custos</span>
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
        {(
          [
            ["associacoes", `Associações (${(data.memberships || []).length})`],
            ["profissionais", `Profissionais (${data.professionals.length})`],
            ["comunidade", `Comunidade (${data.submissions.length})`],
            ["eventos", `Eventos (${data.events.length})`],
            ["custos", `Transparência & Custos (${data.expenses.length})`],
            ["admins", `Admins & Membros (${mergedAccounts.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className="min-h-[42px] rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors"
            style={{
              backgroundColor: tab === key ? "var(--accent-emerald)" : "var(--bg-surface)",
              color: tab === key ? "#FAF7F2" : "var(--text-primary)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TAB 0: Associações */}
      {tab === "associacoes" && (
        <section className="space-y-4">
          {(data.memberships || []).length === 0 ? (
            <div className="rounded-2xl border p-8 text-center text-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
              Nenhuma solicitação de associação recebida ainda.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {data.memberships.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border p-4 flex flex-col justify-between gap-3"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase"
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          color:
                            m.membership_status === "active"
                              ? "var(--accent-emerald)"
                              : m.membership_status === "pending"
                              ? "var(--accent-amber)"
                              : "var(--accent-crimson)",
                        }}
                      >
                        {m.membership_status === "active"
                          ? `Ativo${m.member_number ? ` · ${m.member_number}` : ""}`
                          : m.membership_status === "pending"
                          ? "Pendente"
                          : m.membership_status === "suspended"
                          ? "Suspenso"
                          : "Recusado"}
                      </span>
                      {m.city_state && (
                        <span className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                          {m.city_state}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-display text-base font-semibold">{m.name}</p>
                    <p className="text-xs font-mono-num truncate" style={{ color: "var(--text-muted)" }}>
                      {m.email}
                    </p>
                    <p className="text-xs mt-1 font-medium" style={{ color: "var(--text-secondary)" }}>
                      {m.profile}
                    </p>
                    {m.manifesto && (
                      <p className="mt-2 text-xs italic line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                        &ldquo;{m.manifesto}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                    {m.membership_status === "pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => act({ action: "moderate_membership", id: m.id, status: "active" })}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: "var(--accent-emerald)" }}
                        >
                          <Check className="h-3.5 w-3.5" /> Aprovar Associado
                        </button>
                        <button
                          type="button"
                          onClick={() => act({ action: "moderate_membership", id: m.id, status: "rejected" })}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: "var(--accent-crimson)" }}
                        >
                          <X className="h-3.5 w-3.5" /> Recusar
                        </button>
                      </>
                    ) : m.membership_status === "active" ? (
                      <>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--accent-emerald)" }}>
                          <Check className="h-3.5 w-3.5" /> Associado ativo
                        </span>
                        <button
                          type="button"
                          onClick={() => act({ action: "moderate_membership", id: m.id, status: "suspended" })}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-black/5"
                          style={{ borderColor: "var(--border-subtle)", color: "var(--accent-crimson)" }}
                        >
                          <X className="h-3 w-3" /> Suspender
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--accent-crimson)" }}>
                          <X className="h-3.5 w-3.5" /> {m.membership_status === "suspended" ? "Suspenso" : "Recusado"}
                        </span>
                        <button
                          type="button"
                          onClick={() => act({ action: "moderate_membership", id: m.id, status: "active" })}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-black/5"
                          style={{ borderColor: "var(--accent-emerald)", color: "var(--accent-emerald)" }}
                        >
                          <Check className="h-3 w-3" /> Aprovar / Reativar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 1: Profissionais */}
      {tab === "profissionais" && (
        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.professionals.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border p-4 flex flex-col justify-between gap-3"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        color:
                          p.status === "approved"
                            ? "var(--accent-emerald)"
                            : p.status === "pending"
                            ? "var(--accent-amber)"
                            : "var(--accent-crimson)",
                      }}
                    >
                      {p.status === "approved" ? "Aprovado" : p.status === "pending" ? "Pendente" : "Recusado"}
                    </span>
                    {p.city_state && (
                      <span className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                        {p.city_state}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-display text-base font-semibold">{p.name}</p>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {p.specialty}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                  {p.status === "pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => act({ action: "moderate_professional", id: p.id, status: "approved" })}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: "var(--accent-emerald)" }}
                      >
                        <Check className="h-3.5 w-3.5" /> Aprovar
                      </button>
                      <button
                        type="button"
                        onClick={() => act({ action: "moderate_professional", id: p.id, status: "rejected" })}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: "var(--accent-crimson)" }}
                      >
                        <X className="h-3.5 w-3.5" /> Recusar
                      </button>
                    </>
                  ) : p.status === "approved" ? (
                    <>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--accent-emerald)" }}>
                        <Check className="h-3.5 w-3.5" /> Publicado no diretório
                      </span>
                      <button
                        type="button"
                        onClick={() => act({ action: "moderate_professional", id: p.id, status: "rejected" })}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-black/5"
                        style={{ borderColor: "var(--border-subtle)", color: "var(--accent-crimson)" }}
                      >
                        <X className="h-3 w-3" /> Ocultar
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--accent-crimson)" }}>
                        <X className="h-3.5 w-3.5" /> Oculto do diretório
                      </span>
                      <button
                        type="button"
                        onClick={() => act({ action: "moderate_professional", id: p.id, status: "approved" })}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-black/5"
                        style={{ borderColor: "var(--accent-emerald)", color: "var(--accent-emerald)" }}
                      >
                        <Check className="h-3 w-3" /> Reaprovar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: Comunidade */}
      {tab === "comunidade" && (
        <section className="space-y-4">
          {data.submissions.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center text-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
              Nenhuma submissão na fila ainda. Quando membros enviarem artes, links ou relatos em <code>/comunidade</code>, eles aparecerão aqui para aprovação.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {data.submissions.map((s) => (
                <div
                  key={s.id}
                  className="min-w-0 overflow-hidden rounded-2xl border p-5 flex flex-col justify-between gap-4"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="uppercase font-semibold" style={{ color: "var(--accent-emerald)" }}>
                        {s.kind}
                      </span>
                      <span className="font-semibold">{s.status}</span>
                    </div>
                    <h3 className="mt-1 font-display text-lg font-semibold break-words">{s.title}</h3>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Por {s.author_name}</p>
                    <p className="mt-2 text-sm line-clamp-3 break-all" style={{ color: "var(--text-secondary)" }}>{s.content}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                    {s.status === "pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => act({ action: "moderate_submission", id: s.id, status: "approved" })}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-semibold text-white"
                          style={{ backgroundColor: "var(--accent-emerald)" }}
                        >
                          <Check className="h-3.5 w-3.5" /> Aprovar
                        </button>
                        <button
                          type="button"
                          onClick={() => act({ action: "moderate_submission", id: s.id, status: "rejected" })}
                          className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-semibold text-white"
                          style={{ backgroundColor: "var(--accent-crimson)" }}
                        >
                          <X className="h-3.5 w-3.5" /> Recusar
                        </button>
                      </>
                    ) : s.status === "approved" ? (
                      <>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--accent-emerald)" }}>
                          <Check className="h-3.5 w-3.5" /> Publicado na comunidade
                        </span>
                        <button
                          type="button"
                          onClick={() => act({ action: "moderate_submission", id: s.id, status: "rejected" })}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-black/5"
                          style={{ borderColor: "var(--border-subtle)", color: "var(--accent-crimson)" }}
                        >
                          <X className="h-3 w-3" /> Ocultar
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--accent-crimson)" }}>
                          <X className="h-3.5 w-3.5" /> Recusado / Oculto
                        </span>
                        <button
                          type="button"
                          onClick={() => act({ action: "moderate_submission", id: s.id, status: "approved" })}
                          className="inline-flex items-center justify-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-black/5"
                          style={{ borderColor: "var(--accent-emerald)", color: "var(--accent-emerald)" }}
                        >
                          <Check className="h-3 w-3" /> Reaprovar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: Eventos */}
      {tab === "eventos" && (
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-3">
            <h2 className="font-display text-xl font-semibold">Eventos Publicados</h2>
            {data.events.length === 0 ? (
              <p className="text-sm rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>
                Nenhum evento publicado no banco ainda. Use o formulário ao lado para adicionar o próximo encontro.
              </p>
            ) : (
              data.events.map((ev) => (
                <div key={ev.id} className="rounded-xl border p-4 flex items-start justify-between gap-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono-num font-semibold" style={{ color: "var(--accent-emerald)" }}>
                        {ev.event_date
                          ? new Date(ev.event_date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Data a definir"}
                      </span>
                      <span style={{ color: "var(--text-muted)" }}>· {ev.format}</span>
                    </div>
                    <p className="font-display font-semibold text-base">{ev.title}</p>
                    {ev.description && (
                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                        {ev.description}
                      </p>
                    )}
                    {ev.event_link && (
                      <a
                        href={ev.event_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs underline truncate max-w-full"
                        style={{ color: "var(--accent-emerald)" }}
                      >
                        {ev.event_link}
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => act({ action: "delete_event", id: ev.id })}
                    aria-label={`Remover evento ${ev.title}`}
                    className="p-2 shrink-0 rounded-lg hover:bg-black/5"
                    style={{ color: "var(--accent-crimson)" }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              act({ action: "create_event", ...evForm });
              setEvForm({ title: "", description: "", eventDate: "", format: "Online", imageUrl: "", eventLink: "" });
            }}
            className="rounded-2xl border p-5 space-y-3"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
          >
            <h2 className="font-display text-xl font-semibold">Novo Evento</h2>
            <input required placeholder="Título do evento" value={evForm.title} onChange={(e) => setEvForm({ ...evForm, title: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
            <input required type="datetime-local" value={evForm.eventDate} onChange={(e) => setEvForm({ ...evForm, eventDate: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
            <input placeholder="Formato (ex: Online - YouTube, Presencial SP)" value={evForm.format} onChange={(e) => setEvForm({ ...evForm, format: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
            <input placeholder="URL da imagem de capa" value={evForm.imageUrl} onChange={(e) => setEvForm({ ...evForm, imageUrl: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
            <input required placeholder="Link do evento / inscrição" value={evForm.eventLink} onChange={(e) => setEvForm({ ...evForm, eventLink: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
            <textarea required rows={3} placeholder="Descrição" value={evForm.description} onChange={(e) => setEvForm({ ...evForm, description: e.target.value })} className="w-full rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
            <button type="submit" className="btn-primary inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 text-sm font-semibold">
              <Plus className="h-4 w-4" /> Publicar Evento
            </button>
          </form>
        </section>
      )}

      {/* TAB 4: Custos & Transparência */}
      {tab === "custos" && (
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-3">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <Receipt className="h-5 w-5" style={{ color: "var(--accent-crimson)" }} />
              <span>Custos Registrados (Transparência)</span>
            </h2>
            {data.expenses.length === 0 ? (
              <p className="text-sm rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>
                Nenhum custo lançado ainda. Lance impostos, domínio e infraestrutura ao lado para alimentar a página <code>/apoie</code>.
              </p>
            ) : (
              data.expenses.map((ex) => (
                <div key={ex.id} className="rounded-xl border p-4 flex items-center justify-between" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                  <div>
                    <p className="font-semibold text-sm">[{ex.category}] {ex.description}</p>
                    <p className="font-mono-num text-xs" style={{ color: "var(--accent-crimson)" }}>
                      R$ {(ex.amount_cents / 100).toFixed(2)}
                    </p>
                  </div>
                  <button type="button" onClick={() => act({ action: "delete_expense", id: ex.id })} className="p-2" style={{ color: "var(--accent-crimson)" }}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              act({ action: "create_expense", ...expForm });
              setExpForm({ category: "infraestrutura", description: "", amountReais: "", referenceDate: new Date().toISOString().slice(0, 10) });
            }}
            className="rounded-2xl border p-5 space-y-3"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
          >
            <h2 className="font-display text-xl font-semibold">Lançar Custo / Imposto</h2>
            <select value={expForm.category} onChange={(e) => setExpForm({ ...expForm, category: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}>
              <option value="impostos">Impostos / Tributos</option>
              <option value="infraestrutura">Infraestrutura (Domínio, Vercel, Neon)</option>
              <option value="eventos">Eventos / Divulgação</option>
              <option value="outros">Outros Custos</option>
            </select>
            <input required placeholder="Descrição (ex: Renovação domínio .org.br)" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
            <input required type="number" step="0.01" placeholder="Valor em R$ (ex: 40.00)" value={expForm.amountReais} onChange={(e) => setExpForm({ ...expForm, amountReais: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
            <input type="date" value={expForm.referenceDate} onChange={(e) => setExpForm({ ...expForm, referenceDate: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
            <button type="submit" className="btn-primary inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 text-sm font-semibold">
              <Plus className="h-4 w-4" /> Registrar na Transparência
            </button>
          </form>
        </section>
      )}

      {/* TAB 5: Administradores & Membros */}
      {tab === "admins" && (
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="space-y-3">
            <h2 className="font-display text-xl font-semibold">Contas Cadastradas & Permissões</h2>
            {mergedAccounts.length === 0 ? (
              <p className="text-sm rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>
                Nenhuma conta registrada ainda. Quando os membros entrarem ou você pré-autorizar um e-mail ao lado, eles aparecerão aqui.
              </p>
            ) : (
              mergedAccounts.map((u) => {
                const isMaster = u.email.toLowerCase() === "ghcastellano@gmail.com";
                const isAdmin = u.role === "admin" || isMaster;
                return (
                  <div
                    key={u.id}
                    className="rounded-xl border p-4 flex flex-wrap items-center justify-between gap-3"
                    style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{u.name}</p>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase"
                          style={{
                            backgroundColor: "var(--bg-surface)",
                            color: isAdmin ? "var(--accent-emerald)" : "var(--text-muted)",
                          }}
                        >
                          {isMaster ? "Admin Master" : isAdmin ? "Admin" : "Membro"}
                        </span>
                      </div>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                        {u.email}
                      </p>
                    </div>

                    {!isMaster && (
                      <button
                        type="button"
                        onClick={() =>
                          act({
                            action: "set_user_role",
                            email: u.email,
                            role: isAdmin ? "member" : "admin",
                          })
                        }
                        className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                        style={{
                          borderColor: isAdmin ? "var(--accent-crimson)" : "var(--accent-emerald)",
                          color: isAdmin ? "var(--accent-crimson)" : "var(--accent-emerald)",
                        }}
                      >
                        {isAdmin ? "Remover Admin" : "Tornar Admin"}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              act({ action: "set_user_role", email: newAdminEmail, role: "admin" });
              setNewAdminEmail("");
            }}
            className="rounded-2xl border p-5 space-y-3"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
          >
            <h2 className="font-display text-xl font-semibold">Conceder Acesso Admin</h2>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Informe o e-mail (Gmail ou cadastrado) para liberar acesso administrativo. Se a pessoa ainda não entrou no
              portal, ela já entrará como Admin no primeiro login.
            </p>
            <input
              required
              type="email"
              placeholder="email.da.pessoa@gmail.com"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="w-full min-h-[42px] rounded-xl border px-3 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <button type="submit" className="btn-primary inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 text-sm font-semibold">
              <Shield className="h-4 w-4" /> Liberar Acesso Admin
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
