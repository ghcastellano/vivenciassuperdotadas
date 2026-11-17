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
    event_date: string;
    format: string;
  }[];
  expenses: {
    id: string;
    category: string;
    description: string;
    amount_cents: number;
    reference_date: string;
  }[];
  membersCount: number;
}

type AdminTab = "profissionais" | "comunidade" | "eventos" | "custos";

export function AdminClient({ initialData }: { initialData: AdminData }) {
  const [data, setData] = useState<AdminData>(initialData);
  const [tab, setTab] = useState<AdminTab>("profissionais");
  const [actionNotice, setActionNotice] = useState("");

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

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--border-subtle)" }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
            Gestão da Associação
          </p>
          <h1 className="font-display text-3xl font-semibold">Painel Administrativo</h1>
        </div>
        {data.readOnly && (
          <Link href="/entrar" className="btn-primary rounded-xl px-4 py-2 text-xs font-semibold">
            Entrar como Admin para editar
          </Link>
        )}
      </div>

      {data.readOnly && (
        <div
          className="flex items-center gap-2.5 rounded-2xl border p-4 text-xs sm:text-sm"
          style={{ borderColor: "var(--accent-amber)", backgroundColor: "var(--bg-surface)" }}
        >
          <Shield className="h-4 w-4 shrink-0" style={{ color: "var(--accent-amber)" }} />
          <span>
            <strong>Visualização Aberta (Demonstração):</strong> você pode navegar por todas as abas e dados reais do
            Neon Postgres. Alterações (aprovar, criar, excluir) exigem login de administrador.
          </span>
        </div>
      )}

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
            <span>Associados</span>
            <Users className="h-4 w-4" style={{ color: "var(--accent-emerald)" }} />
          </div>
          <p className="font-mono-num mt-2 text-2xl font-bold">{data.membersCount}</p>
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
            ["profissionais", `Profissionais (${data.professionals.length})`],
            ["comunidade", `Comunidade (${data.submissions.length})`],
            ["eventos", `Eventos (${data.events.length})`],
            ["custos", `Transparência & Custos (${data.expenses.length})`],
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

                <div className="flex gap-2 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
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
                  <div className="flex gap-2">
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
                <div key={ev.id} className="rounded-xl border p-4 flex items-center justify-between" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                  <div>
                    <p className="font-semibold text-sm">{ev.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{ev.format}</p>
                  </div>
                  <button type="button" onClick={() => act({ action: "delete_event", id: ev.id })} className="p-2" style={{ color: "var(--accent-crimson)" }}>
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
    </div>
  );
}
