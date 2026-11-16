"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Check, X, Trash2, Plus } from "lucide-react";

interface AdminData {
  professionals: {
    id: string;
    name: string;
    email: string;
    registry_code: string;
    specialty: string;
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

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

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
    if (res.status === 403) {
      setUnauthorized(true);
      return;
    }
    if (res.ok) {
      setData(await res.json());
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (payload: Record<string, unknown>) => {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (unauthorized) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <div className="rounded-2xl border p-8 space-y-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          <Shield className="mx-auto h-10 w-10" style={{ color: "var(--accent-crimson)" }} />
          <h1 className="font-display text-2xl font-semibold">Área Restrita à Administração</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Entre com uma conta de administrador (definida em <code>ADMIN_EMAILS</code> ou <code>ADMIN_EMAIL</code>) para
            aprovar profissionais, moderar criações, gerenciar eventos e lançar custos na transparência.
          </p>
          <Link href="/entrar" className="btn-primary inline-flex min-h-[44px] items-center rounded-xl px-5 py-2.5 text-sm font-semibold">
            Fazer login como Admin
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="mx-auto max-w-6xl px-5 py-12 text-sm">Carregando painel administrativo...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--border-subtle)" }}>
        <div>
          <h1 className="font-display text-3xl font-semibold">Painel Administrativo</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Associados registrados: <strong className="font-mono-num">{data.membersCount}</strong>
          </p>
        </div>
      </div>

      {/* Professionals approval */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Profissionais Parceiros</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.professionals.map((p) => (
            <div key={p.id} className="rounded-2xl border p-4 flex items-center justify-between gap-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <div>
                <p className="font-semibold text-sm">{p.name} · <span className="font-mono-num text-xs">{p.registry_code}</span></p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{p.specialty} ({p.status})</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => act({ action: "moderate_professional", id: p.id, status: "approved" })}
                  className="rounded-lg p-2 text-white"
                  style={{ backgroundColor: "var(--accent-emerald)" }}
                  title="Aprovar"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => act({ action: "moderate_professional", id: p.id, status: "rejected" })}
                  className="rounded-lg p-2 text-white"
                  style={{ backgroundColor: "var(--accent-crimson)" }}
                  title="Recusar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community moderation */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Moderação da Comunidade (Artes, Links, Relatos)</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.submissions.map((s) => (
            <div key={s.id} className="rounded-2xl border p-4 flex items-start justify-between gap-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <div>
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Por {s.author_name} · {s.kind} · Status: <strong>{s.status}</strong>
                </p>
                <p className="mt-1 text-xs line-clamp-2" style={{ color: "var(--text-secondary)" }}>{s.content}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => act({ action: "moderate_submission", id: s.id, status: "approved" })}
                  className="rounded-lg p-2 text-white"
                  style={{ backgroundColor: "var(--accent-emerald)" }}
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => act({ action: "moderate_submission", id: s.id, status: "rejected" })}
                  className="rounded-lg p-2 text-white"
                  style={{ backgroundColor: "var(--accent-crimson)" }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Management */}
      <section className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            act({ action: "create_event", ...evForm });
            setEvForm({ title: "", description: "", eventDate: "", format: "Online", imageUrl: "", eventLink: "" });
          }}
          className="rounded-2xl border p-5 space-y-3"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <h2 className="font-display text-xl font-semibold">Adicionar Próximo Evento</h2>
          <input required placeholder="Título do evento" value={evForm.title} onChange={(e) => setEvForm({ ...evForm, title: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
          <input required type="datetime-local" value={evForm.eventDate} onChange={(e) => setEvForm({ ...evForm, eventDate: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
          <input placeholder="Formato (ex: Online - YouTube, Presencial SP)" value={evForm.format} onChange={(e) => setEvForm({ ...evForm, format: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
          <input placeholder="URL da imagem de capa" value={evForm.imageUrl} onChange={(e) => setEvForm({ ...evForm, imageUrl: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
          <input required placeholder="Link do evento / inscrição" value={evForm.eventLink} onChange={(e) => setEvForm({ ...evForm, eventLink: e.target.value })} className="w-full min-h-[42px] rounded-xl border px-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
          <textarea required rows={2} placeholder="Descrição" value={evForm.description} onChange={(e) => setEvForm({ ...evForm, description: e.target.value })} className="w-full rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }} />
          <button type="submit" className="btn-primary inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 text-sm font-semibold">
            <Plus className="h-4 w-4" /> Publicar Evento
          </button>
        </form>

        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Eventos Publicados</h2>
          {data.events.map((ev) => (
            <div key={ev.id} className="rounded-xl border p-3.5 flex items-center justify-between" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <div>
                <p className="font-semibold text-sm">{ev.title}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{ev.format}</p>
              </div>
              <button type="button" onClick={() => act({ action: "delete_event", id: ev.id })} className="p-2" style={{ color: "var(--accent-crimson)" }}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Expenses for Transparency */}
      <section className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            act({ action: "create_expense", ...expForm });
            setExpForm({ category: "infraestrutura", description: "", amountReais: "", referenceDate: new Date().toISOString().slice(0, 10) });
          }}
          className="rounded-2xl border p-5 space-y-3"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <h2 className="font-display text-xl font-semibold">Lançar Custo / Imposto (Transparência)</h2>
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

        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Custos Registrados</h2>
          {data.expenses.map((ex) => (
            <div key={ex.id} className="rounded-xl border p-3.5 flex items-center justify-between" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
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
          ))}
        </div>
      </section>
    </div>
  );
}
