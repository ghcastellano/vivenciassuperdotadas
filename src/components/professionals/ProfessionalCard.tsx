"use client";

import React from "react";
import { MapPin, Mail, ExternalLink, MessageCircle } from "lucide-react";
import {
  classifySpecialty,
  SERVICE_TYPE_LABELS,
  type PartnerItem,
} from "@/lib/professionals-filter";

function toWhatsAppHref(rawPhone: string, profName: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  const full = digits.startsWith("55") ? digits : `55${digits}`;
  const msg = encodeURIComponent(
    `Olá ${profName}, vim pelo site Vivências Superdotadas e gostaria de mais informações sobre seu atendimento.`
  );
  return `https://wa.me/${full}?text=${msg}`;
}

export function ProfessionalCard({ partner }: { partner: PartnerItem }) {
  const category = classifySpecialty(partner.specialty);
  const serviceLabel = SERVICE_TYPE_LABELS[partner.service_type || "ambos"] || "Avaliação e Acompanhamento";

  return (
    <div className="editorial-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-mono-num text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--accent-emerald)" }}
          >
            {category}
          </span>
          {partner.registry_code && (
            <span className="font-mono-num text-[11px]" style={{ color: "var(--text-muted)" }}>
              {partner.registry_code}
            </span>
          )}
        </div>

        <h2 className="mt-2.5 font-display text-xl font-semibold">{partner.name}</h2>
        <p className="mt-1 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          {serviceLabel}
          {partner.approach ? ` · ${partner.approach}` : ""}
        </p>

        {(partner.other_qualifications || partner.bio) && (
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {partner.other_qualifications || partner.bio}
          </p>
        )}

        <div className="mt-4 space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
          {partner.whatsapp && (
            <a
              href={toWhatsAppHref(partner.whatsapp, partner.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex min-h-[38px] items-center gap-2 px-3.5 py-1.5 text-xs font-semibold"
              title="Abrir conversa no WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="font-mono-num">WhatsApp · {partner.whatsapp}</span>
            </a>
          )}
          {partner.email && (
            <p className="flex items-center gap-2 break-all" style={{ color: "var(--text-muted)" }}>
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span>{partner.email}</span>
            </p>
          )}
        </div>
      </div>

      <div
        className="mt-5 border-t pt-3 flex items-center justify-between gap-2 text-xs"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <span className="inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{partner.city_state || [partner.city, partner.state].filter(Boolean).join(" - ") || "Brasil"}</span>
        </span>
        {(partner.social_url || partner.contact_url) && (
          <a
            href={partner.social_url || partner.contact_url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-editorial inline-flex items-center gap-1 font-semibold"
          >
            <span>Perfil</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
