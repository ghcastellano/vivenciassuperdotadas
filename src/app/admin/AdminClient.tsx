"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { Shield, Check, X, Trash2, Plus, Users, Stethoscope, Calendar, Receipt, MessageSquare, Pencil, Table2, LayoutGrid, Search } from "lucide-react";

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
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState<"all" | "upcoming" | "past">("all");
  const [expenseCatFilter, setExpenseCatFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "member">("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;
  const [editingProf, setEditingProf] = useState<{
    id: string;
    name: string;
    email: string;
    registryCode: string;
    specialty: string;
    cityState: string;
  } | null>(null);

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
    if (res.ok) {
      const action = String(payload.action || "");
      const { markRoutesDirty } = await import("@/lib/route-freshness");
      if (action === "moderate_submission" || action === "moderate_membership") {
        markRoutesDirty(["/comunidade", "/perfil"]);
      } else if (action === "moderate_professional") {
        markRoutesDirty(["/profissionais"]);
      } else if (action === "create_event" || action === "delete_event") {
        markRoutesDirty(["/eventos"]);
      } else if (action === "create_expense" || action === "delete_expense") {
        markRoutesDirty(["/apoie"]);
      }
    }
    await load();
  };

  const pendingProfs = data.professionals.filter((p) => p.status === "pending");
  const approvedProfs = data.professionals.filter((p) => p.status === "approved");
  const pendingSubs = data.submissions.filter((s) => s.status === "pending");
  const pendingMembers = (data.memberships || []).filter((m) => m.membership_status === "pending");

  const qLower = searchQuery.trim().toLowerCase();
  const filteredMembers = (data.memberships || []).filter((m) => {
    const matchesStatus = statusFilter === "all" || m.membership_status === statusFilter;
    const matchesQ =
      !qLower ||
      [m.name, m.email, m.profile, m.city_state, m.member_number]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(qLower));
    return matchesStatus && matchesQ;
  });

  const filteredProfs = data.professionals.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesQ =
      !qLower ||
      [p.name, p.email, p.specialty, p.registry_code, p.city_state]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(qLower));
    return matchesStatus && matchesQ;
  });

  const filteredSubmissions = data.submissions.filter((s) => {
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const matchesKind = kindFilter === "all" || s.kind === kindFilter;
    const matchesQ =
      !qLower ||
      [s.title, s.author_name, s.content]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(qLower));
    return matchesStatus && matchesKind && matchesQ;
  });

  const nowMs = Date.now();
  const filteredEvents = data.events.filter((ev) => {
    const evTime = ev.event_date ? new Date(ev.event_date).getTime() : 0;
    const matchesPeriod =
      eventFilter === "all" ||
      (eventFilter === "upcoming" ? evTime >= nowMs : evTime > 0 && evTime < nowMs);
    const matchesQ =
      !qLower ||
      [ev.title, ev.format, ev.description || ""].some((v) => v.toLowerCase().includes(qLower));
    return matchesPeriod && matchesQ;
  });

  const filteredExpenses = data.expenses.filter((ex) => {
    const matchesCat = expenseCatFilter === "all" || ex.category === expenseCatFilter;
    const matchesQ =
      !qLower ||
      [ex.description, ex.category].some((v) => v.toLowerCase().includes(qLower));
    return matchesCat && matchesQ;
  });
  const filteredExpensesTotalCents = filteredExpenses.reduce((acc, ex) => acc + Number(ex.amount_cents || 0), 0);

  const paginate = <T,>(items: T[]): T[] => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  };

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

  const filteredAccounts = mergedAccounts.filter((u) => {
    const isMaster = u.email.toLowerCase() === "ghcastellano@gmail.com";
    const isAdmin = u.role === "admin" || isMaster;
    const matchesRole = roleFilter === "all" || (roleFilter === "admin" ? isAdmin : !isAdmin);
    const matchesQ = !qLower || [u.name, u.email].some((v) => v.toLowerCase().includes(qLower));
    return matchesRole && matchesQ;
  });

  const pagedMembers = paginate(filteredMembers);
  const pagedProfs = paginate(filteredProfs);
  const pagedSubmissions = paginate(filteredSubmissions);
  const pagedEvents = paginate(filteredEvents);
  const pagedExpenses = paginate(filteredExpenses);
  const pagedAccounts = paginate(filteredAccounts);

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    if (totalItems <= PAGE_SIZE) return null;
    return (
      <div
        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-xs"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
      >
        <span className="font-mono-num" style={{ color: "var(--text-muted)" }}>
          Página {page} de {totalPages} · {totalItems} registros
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border px-3 py-1 font-semibold disabled:opacity-40"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border px-3 py-1 font-semibold disabled:opacity-40"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            Próxima
          </button>
        </div>
      </div>
    );
  };

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
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
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

        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
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

        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
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

        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
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
            onClick={() => {
              setTab(key);
              setStatusFilter("all");
              setKindFilter("all");
              setEventFilter("all");
              setExpenseCatFilter("all");
              setRoleFilter("all");
              setPage(1);
            }}
            className="min-h-[40px] rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition-colors"
            style={{
              backgroundColor: tab === key ? "var(--accent-emerald)" : "var(--bg-surface)",
              color: tab === key ? "#FFFFFF" : "var(--text-primary)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Barra de Busca, Filtro & Modo Tabela/Cards para Associações e Profissionais */}
      {(tab === "associacoes" || tab === "profissionais") && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={
                tab === "associacoes"
                  ? "Buscar por nome, e-mail, matrícula, perfil ou cidade..."
                  : "Buscar por nome, especialidade, CRP/CRM ou cidade..."
              }
              className="min-h-[40px] w-full rounded-xl border pl-9 pr-3 text-xs sm:text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrar por status"
            className="min-h-[40px] rounded-xl border px-3 text-xs sm:text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            <option value="all">Status: Todos</option>
            <option value="pending">Pendentes</option>
            <option value={tab === "associacoes" ? "active" : "approved"}>
              {tab === "associacoes" ? "Ativos" : "Aprovados"}
            </option>
            {tab === "associacoes" && <option value="suspended">Suspensos</option>}
            <option value="rejected">Recusados</option>
            {tab === "associacoes" && <option value="deleted">Inativos (Excluídos)</option>}
          </select>

          <div
            className="inline-flex rounded-xl border p-1"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: viewMode === "table" ? "var(--accent-emerald)" : "transparent",
                color: viewMode === "table" ? "#FFFFFF" : "var(--text-secondary)",
              }}
            >
              <Table2 className="h-3.5 w-3.5" />
              <span>Tabela</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: viewMode === "cards" ? "var(--accent-emerald)" : "transparent",
                color: viewMode === "cards" ? "#FFFFFF" : "var(--text-secondary)",
              }}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 0: Associações */}
      {tab === "associacoes" && (
        <section className="space-y-4">
          {filteredMembers.length === 0 ? (
            <div className="rounded-xl border p-8 text-center text-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
              Nenhuma solicitação encontrada para os filtros selecionados.
            </div>
          ) : viewMode === "table" ? (
            <div
              className="overflow-x-auto rounded-xl border"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
            >
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b text-[11px] uppercase tracking-wider" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)", backgroundColor: "var(--bg-surface)" }}>
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nome &amp; E-mail</th>
                    <th className="px-4 py-3 font-semibold">Perfil / Cidade</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                  {pagedMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-black/[0.02]">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{m.name}</p>
                        <p className="font-mono-num text-xs" style={{ color: "var(--text-muted)" }}>{m.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p>{m.profile}</p>
                        {m.city_state && <p style={{ color: "var(--text-muted)" }}>{m.city_state}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase"
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
                            : m.membership_status === "deleted"
                            ? "Inativo"
                            : "Recusado"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-1.5">
                          {m.membership_status !== "active" && (
                            <button
                              type="button"
                              onClick={() => act({ action: "moderate_membership", id: m.id, status: "active" })}
                              className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-white"
                              style={{ backgroundColor: "var(--accent-emerald)" }}
                            >
                              {m.membership_status === "pending" ? "Aprovar" : "Reativar"}
                            </button>
                          )}
                          {m.membership_status === "active" && (
                            <button
                              type="button"
                              onClick={() => act({ action: "moderate_membership", id: m.id, status: "suspended" })}
                              className="rounded-md border px-2.5 py-1 text-[11px] font-semibold"
                              style={{ borderColor: "var(--border-subtle)", color: "var(--accent-crimson)" }}
                            >
                              Suspender
                            </button>
                          )}
                          {m.membership_status !== "deleted" && (
                            <button
                              type="button"
                              onClick={() => act({ action: "moderate_membership", id: m.id, status: "deleted" })}
                              className="rounded-md border px-2.5 py-1 text-[11px] font-semibold"
                              style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
                            >
                              Inativar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {pagedMembers.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border p-4 flex flex-col justify-between gap-3"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase"
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
          {renderPagination(filteredMembers.length)}
        </section>
      )}

      {/* TAB 1: Profissionais */}
      {tab === "profissionais" && (
        <section className="space-y-4">
          {filteredProfs.length === 0 ? (
            <div className="rounded-xl border p-8 text-center text-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
              Nenhum profissional encontrado para os filtros selecionados.
            </div>
          ) : viewMode === "table" ? (
            <div
              className="overflow-x-auto rounded-xl border"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
            >
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b text-[11px] uppercase tracking-wider" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)", backgroundColor: "var(--bg-surface)" }}>
                  <tr>
                    <th className="px-4 py-3 font-semibold">Profissional &amp; Registro</th>
                    <th className="px-4 py-3 font-semibold">Especialidade / Local</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                  {pagedProfs.map((p) => (
                    <tr key={p.id} className="hover:bg-black/[0.02]">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{p.name}</p>
                        <p className="font-mono-num text-xs" style={{ color: "var(--text-muted)" }}>
                          {p.registry_code || "Sem registro"} {p.email ? `· ${p.email}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p>{p.specialty}</p>
                        {p.city_state && <p style={{ color: "var(--text-muted)" }}>{p.city_state}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase"
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
                          {p.status === "approved" ? "Aprovado" : p.status === "pending" ? "Pendente" : "Oculto"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProf({
                                id: p.id,
                                name: p.name,
                                email: p.email || "",
                                registryCode: p.registry_code || "",
                                specialty: p.specialty,
                                cityState: p.city_state || "",
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-semibold hover:bg-black/5"
                            style={{ borderColor: "var(--border-subtle)" }}
                          >
                            <Pencil className="h-3 w-3" /> Editar
                          </button>
                          {p.status !== "approved" && (
                            <button
                              type="button"
                              onClick={() => act({ action: "moderate_professional", id: p.id, status: "approved" })}
                              className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-white"
                              style={{ backgroundColor: "var(--accent-emerald)" }}
                            >
                              Aprovar
                            </button>
                          )}
                          {p.status === "approved" && (
                            <button
                              type="button"
                              onClick={() => act({ action: "moderate_professional", id: p.id, status: "rejected" })}
                              className="rounded-md border px-2.5 py-1 text-[11px] font-semibold"
                              style={{ borderColor: "var(--border-subtle)", color: "var(--accent-crimson)" }}
                            >
                              Ocultar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {pagedProfs.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border p-4 flex flex-col justify-between gap-3"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase"
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
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProf({
                        id: p.id,
                        name: p.name,
                        email: p.email || "",
                        registryCode: p.registry_code || "",
                        specialty: p.specialty,
                        cityState: p.city_state || "",
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold hover:bg-black/5"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <Pencil className="h-3 w-3" /> Editar
                  </button>
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
          )}
          {renderPagination(filteredProfs.length)}
        </section>
      )}

      {/* TAB 2: Comunidade */}
      {tab === "comunidade" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar por título, autor(a) ou conteúdo..."
                className="min-h-[40px] w-full rounded-xl border pl-9 pr-3 text-xs sm:text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="min-h-[40px] rounded-xl border px-3 text-xs sm:text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            >
              <option value="all">Status: Todos</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Recusados</option>
            </select>
            <select
              value={kindFilter}
              onChange={(e) => {
                setKindFilter(e.target.value);
                setPage(1);
              }}
              className="min-h-[40px] rounded-xl border px-3 text-xs sm:text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            >
              <option value="all">Tipo: Todos</option>
              <option value="relato">Relato</option>
              <option value="arte">Arte</option>
              <option value="link">Link</option>
            </select>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="rounded-xl border p-8 text-center text-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
              Nenhuma submissão encontrada para os filtros selecionados.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pagedSubmissions.map((s) => (
                <div
                  key={s.id}
                  className="min-w-0 overflow-hidden rounded-xl border p-5 flex flex-col justify-between gap-4"
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
          {renderPagination(filteredSubmissions.length)}
        </section>
      )}

      {/* TAB 3: Eventos */}
      {tab === "eventos" && (
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-semibold">Eventos Publicados</h2>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Buscar evento..."
                  className="min-h-[36px] rounded-lg border px-3 text-xs"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
                />
                <select
                  value={eventFilter}
                  onChange={(e) => {
                    setEventFilter(e.target.value as "all" | "upcoming" | "past");
                    setPage(1);
                  }}
                  className="min-h-[36px] rounded-lg border px-2.5 text-xs"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
                >
                  <option value="all">Todos</option>
                  <option value="upcoming">Próximos</option>
                  <option value="past">Passados</option>
                </select>
              </div>
            </div>
            {filteredEvents.length === 0 ? (
              <p className="text-sm rounded-xl border p-6" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>
                Nenhum evento encontrado para o filtro selecionado.
              </p>
            ) : (
              pagedEvents.map((ev) => (
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
            {renderPagination(filteredEvents.length)}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              act({ action: "create_event", ...evForm });
              setEvForm({ title: "", description: "", eventDate: "", format: "Online", imageUrl: "", eventLink: "" });
            }}
            className="rounded-xl border p-5 space-y-3"
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <Receipt className="h-5 w-5" style={{ color: "var(--accent-crimson)" }} />
                <span>Custos Registrados</span>
              </h2>
              <span className="font-mono-num text-xs font-semibold" style={{ color: "var(--accent-crimson)" }}>
                Subtotal: R$ {(filteredExpensesTotalCents / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar descrição..."
                className="min-h-[36px] flex-1 min-w-[180px] rounded-lg border px-3 text-xs"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              />
              <select
                value={expenseCatFilter}
                onChange={(e) => {
                  setExpenseCatFilter(e.target.value);
                  setPage(1);
                }}
                className="min-h-[36px] rounded-lg border px-2.5 text-xs"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
              >
                <option value="all">Categoria: Todas</option>
                <option value="impostos">Impostos / Tributos</option>
                <option value="infraestrutura">Infraestrutura</option>
                <option value="eventos">Eventos / Divulgação</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            {filteredExpenses.length === 0 ? (
              <p className="text-sm rounded-xl border p-6" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>
                Nenhum custo encontrado para os filtros selecionados.
              </p>
            ) : (
              pagedExpenses.map((ex) => (
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
            {renderPagination(filteredExpenses.length)}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              act({ action: "create_expense", ...expForm });
              setExpForm({ category: "infraestrutura", description: "", amountReais: "", referenceDate: new Date().toISOString().slice(0, 10) });
            }}
            className="rounded-xl border p-5 space-y-3"
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-semibold">Contas Cadastradas &amp; Permissões</h2>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Buscar nome ou e-mail..."
                  className="min-h-[36px] rounded-lg border px-3 text-xs"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
                />
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value as "all" | "admin" | "member");
                    setPage(1);
                  }}
                  className="min-h-[36px] rounded-lg border px-2.5 text-xs"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
                >
                  <option value="all">Todos</option>
                  <option value="admin">Apenas Admins</option>
                  <option value="member">Apenas Membros</option>
                </select>
              </div>
            </div>
            {filteredAccounts.length === 0 ? (
              <p className="text-sm rounded-xl border p-6" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>
                Nenhuma conta encontrada para os filtros selecionados.
              </p>
            ) : (
              pagedAccounts.map((u) => {
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
                          className="rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase"
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
            {renderPagination(filteredAccounts.length)}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              act({ action: "set_user_role", email: newAdminEmail, role: "admin" });
              setNewAdminEmail("");
            }}
            className="rounded-xl border p-5 space-y-3"
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

      {/* Modal de Edição de Profissional */}
      {editingProf && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          onClick={() => setEditingProf(null)}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await act({ action: "edit_professional", ...editingProf });
              setEditingProf(null);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border p-6 shadow-2xl space-y-4"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Editar Profissional</h3>
              <button
                type="button"
                onClick={() => setEditingProf(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-black/5"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="block space-y-1 text-xs">
              <span className="font-medium">Nome *</span>
              <input
                required
                value={editingProf.name}
                onChange={(e) => setEditingProf({ ...editingProf, name: e.target.value })}
                className="w-full min-h-[40px] rounded-lg border px-3 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>
            <label className="block space-y-1 text-xs">
              <span className="font-medium">Especialidade *</span>
              <input
                required
                value={editingProf.specialty}
                onChange={(e) => setEditingProf({ ...editingProf, specialty: e.target.value })}
                className="w-full min-h-[40px] rounded-lg border px-3 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1 text-xs">
                <span className="font-medium">Registro (CRP/CRM)</span>
                <input
                  value={editingProf.registryCode}
                  onChange={(e) => setEditingProf({ ...editingProf, registryCode: e.target.value })}
                  className="w-full min-h-[40px] rounded-lg border px-3 text-sm"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
                />
              </label>
              <label className="block space-y-1 text-xs">
                <span className="font-medium">Cidade / UF</span>
                <input
                  value={editingProf.cityState}
                  onChange={(e) => setEditingProf({ ...editingProf, cityState: e.target.value })}
                  className="w-full min-h-[40px] rounded-lg border px-3 text-sm"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
                />
              </label>
            </div>
            <label className="block space-y-1 text-xs">
              <span className="font-medium">E-mail</span>
              <input
                type="email"
                value={editingProf.email}
                onChange={(e) => setEditingProf({ ...editingProf, email: e.target.value })}
                className="w-full min-h-[40px] rounded-lg border px-3 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingProf(null)}
                className="btn-secondary rounded-lg px-4 py-2 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-xs font-semibold">
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
