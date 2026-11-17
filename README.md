# Vivências Superdotadas

> **Associação de Apoio às Altas Habilidades/Superdotação (AH/SD) e Dupla Excepcionalidade (2e)**  
> Portal institucional, rede de profissionais parceiros, divulgação científica, comunidade em primeira pessoa e transparência financeira aberta.

**Produção:** [vivenciassuperdotadas.vercel.app](https://vivenciassuperdotadas.vercel.app)

---

## Arquitetura & Princípios de Engenharia

O projeto foi estruturado seguindo **Clean Architecture**, **SOLID** e separação estrita de responsabilidades:

- **App Router SSR + CSR sem flash de sessão:** `RootLayout` injeta a sessão autenticada no `AuthSessionProvider` diretamente no servidor, eliminando transições de "não logado → logado" em todas as páginas.
- **Identidade vs. Vínculo Associativo Legal:**
  - `users` gerencia apenas autenticação (Google OAuth + Credenciais com `bcryptjs`).
  - `memberships` controla o fluxo associativo formal (`pending` → aprovação manual em `/admin` → `active` com matrícula `VS-AAAA-XXXX`, aceite de Estatuto + LGPD e Código de Boa Convivência).
- **Módulos desacoplados e reutilizáveis:**
  - `src/lib/professionals-filter.ts`: lógica pura e testável de normalização, inferência de região e classificação de especialidades.
  - `src/components/professionals/`: `ProfessionalCard` e `ProfessionalRegisterForm` (com anuência LGPD explícita).
  - `src/components/editorial/`: componentes autorais (`BotanicalSpecimenFrame`, `EditorialIndexRail`, `AssynchronyDiagram`, `AdminMillenniumGate`).
  - `src/lib/mercadopago.ts` & `src/app/api/webhooks/mercadopago/`: integração oficial Mercado Pago Checkout Pro v2 com validação HMAC-SHA256.

---

## Tech Stack

| Camada | Tecnologias |
|---|---|
| **Framework & UI** | Next.js `16` (App Router + Turbopack), React `19`, TypeScript, Tailwind CSS `4`, Motion, Lucide Icons |
| **Tipografia & Acessibilidade** | `Fraunces` (Display Editorial), `Atkinson Hyperlegible` & `Lexend` (Conforto Sensorial), `JetBrains Mono` |
| **Avatares** | `@dicebear/core` + `@dicebear/collection` com renderização SVG determinística |
| **Banco de Dados** | Neon Serverless Postgres (`pg`) com migração idempotente (`ensureSchema`) |
| **Autenticação** | NextAuth / Auth.js v5 (`Google OAuth` + `Credentials`) |
| **Pagamentos & Transparência** | Mercado Pago SDK v2 (Checkout Pro: Pix, Cartão e Boleto) + Stripe fallback |
| **Testes & CI/CD** | `node --test` (unitários e integração), Playwright (Desktop, Tablet e Mobile), GitHub Actions & Vercel |

---

## Sistema Visual & Paleta Oficial

Paleta extraída da pintura fundadora da associação (`public/images/logo-vivencias.jpg`):
- **Primária (`Green Pea`):** `#18492D` (tema escuro: `#3B9963`)
- **Secundária (`Tall Poppy`):** `#BD4626` (tema escuro: `#F05C34`)
- **Superfícies & Filetes (`Conch` / `Santas Gray`):** `#CDD8D5` / `#9C9AAF`
- **Conforto Sensorial:** alternância entre Papel Claro e Carvão Escuro, troca de fonte (`Atkinson` / `Lexend`), escala tipográfica (`A / A+ / A++`), redução de movimento e Modo Foco.

---

## Variáveis de Ambiente

Configure em `.env.local` (desenvolvimento) e na Vercel (produção). **Nunca versione chaves reais.**

```env
DATABASE_URL=
DATABASE_URL_UNPOOLED=
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAILS=
NEXT_PUBLIC_SITE_URL=https://vivenciassuperdotadas.vercel.app
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
```

---

## Como Rodar Localmente & Validar

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção + checagem TypeScript
npm run build

# Testes unitários
node --test tests/unit.test.mjs

# Testes de integração HTTP (com servidor rodando na porta 3000)
node --test tests/run-tests.mjs

# Testes E2E multi-viewport (Desktop 1440px, Tablet 768px, Mobile 390px)
node tests/e2e-playwright.mjs
```

---

## Privacidade & LGPD

- A página `/privacidade` detalha o tratamento de dados conforme a Lei nº 13.709/2018.
- O cadastro de profissionais exige anuência explícita para exibição pública no diretório.
- Na comunidade (`/comunidade`), o painel coletivo exibe apenas a contagem agregada de associados ativos e uma amostra anônima de avatares de quem optou explicitamente por exibi-los.
