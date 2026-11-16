# Vivências Superdotadas

[![CI — Vivências Superdotadas](https://github.com/ghcastellano/vivenciassuperdotadas/actions/workflows/ci.yml/badge.svg)](https://github.com/ghcastellano/vivenciassuperdotadas/actions/workflows/ci.yml)

Portal oficial da associação **Vivências Superdotadas** — acolhimento, ciência, voz em primeira pessoa, exploração pessoal (sem diagnóstico) e transparência financeira.

## Stack & Arquitetura
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion
- **Banco de Dados:** Neon Postgres (`pg` + `@vercel/functions`)
- **Autenticação:** Auth.js v5 (Google OAuth + E-mail/Senha com `bcryptjs`)
- **Pagamentos & Transparência:** Stripe Checkout & Webhooks + Portal de Transparência
- **Avatares Únicos:** `@dicebear/core` + `@dicebear/collection` com selos de neurodivergência ($\infty$)

## Desenvolvimento Local
1. Copie `.env.example` para `.env.local` (ou execute `neon deploy` para puxar `DATABASE_URL`).
2. Instale e rode:
   ```bash
   npm install
   npm run dev
   ```
3. Testes:
   ```bash
   node --test tests/unit.test.mjs
   ```
