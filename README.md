# Barbearia · Agendamento

Sistema profissional de agendamento para barbearia, preparado para produção.
Next.js 15 (App Router) + TypeScript, Prisma, Auth.js e Tailwind.

## Stack

- **Next.js 15 / React 19 / TypeScript** — front + back no mesmo projeto
- **Prisma** — ORM e migrations (SQLite no dev, PostgreSQL em produção)
- **Auth.js (NextAuth v5)** — login por e-mail/senha (Credentials)
- **Tailwind CSS** — identidade visual premium + animações discretas
- **Resend** — notificações por e-mail (com fallback de log no dev)
- **Zod** — validação ponta a ponta

## Como rodar (dev)

```bash
npm install
cp .env.example .env      # já existe um .env de dev com SQLite
npm run db:migrate        # cria o banco (SQLite: prisma/dev.db)
npm run db:seed           # popula serviços + admin + barbeiros
npm run dev               # http://localhost:3000
```

### Acessos de teste (seed)

| Papel    | E-mail                  | Senha       |
| -------- | ----------------------- | ----------- |
| Admin    | admin@barbearia.dev     | admin123    |
| Barbeiro | rafael@barbearia.dev    | barber123   |
| Barbeiro | marcos@barbearia.dev    | barber123   |

Clientes criam a própria conta em `/cadastro`.

## Scripts

| Comando             | Ação                                   |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento            |
| `npm run build`     | `prisma generate` + build de produção  |
| `npm run start`     | Servidor de produção                   |
| `npm run typecheck` | Checagem de tipos                      |
| `npm run db:studio` | Prisma Studio (inspecionar o banco)    |
| `npm run db:seed`   | Repopular dados de exemplo             |

## Arquitetura

```
src/
├── app/                  # rotas (público, cliente, /admin, /api)
├── components/
│   ├── ui/               # primitivos (Button, Input, Card...)
│   ├── auth/ booking/ admin/ layout/
├── lib/                  # db, auth, validações (Zod), config, utils
├── server/
│   ├── services/         # REGRAS DE NEGÓCIO (slots, appointments, notifications)
│   └── actions/          # server actions (auth, appointments, admin)
└── types/
```

A lógica de negócio fica isolada em `server/services` e nunca dentro de componentes.

### Anti-overbooking

A garantia de não haver dois agendamentos no mesmo horário é feita em camadas:

1. **Constraint única** `@@unique([barberId, startTime])` no banco.
2. **Transação** no `createAppointment` revalidando sobreposição de duração
   (não só o horário exato) contra agendamentos ativos e bloqueios.
3. Cálculo de disponibilidade derivado de: expediente − agendamentos −
   bloqueios − antecedência mínima (`server/services/slots.ts`).

## Migrar para PostgreSQL (produção)

1. Em `prisma/schema.prisma`, troque `provider = "sqlite"` por `"postgresql"`.
2. Defina `DATABASE_URL` apontando para o Postgres (Neon, Supabase, etc.).
3. `npx prisma migrate dev --name init` (gera nova migration) e `npm run db:seed`.

> Os enums de domínio já vivem em `src/lib/enums.ts` (campos `String`), o que
> mantém o modelo portável entre SQLite e PostgreSQL.

## Variáveis de ambiente

Veja `.env.example`. Em produção, configure no mínimo `DATABASE_URL`,
`AUTH_SECRET` (gere com `npx auth secret`) e, para e-mails reais,
`RESEND_API_KEY` + `EMAIL_FROM`.

> **Fuso horário (produção):** o cálculo de horários e do expediente usa o
> horário **local do processo**. Em hosts UTC (ex.: Vercel), defina
> `TZ="America/Sao_Paulo"` (ou o fuso da barbearia) para os horários não
> ficarem deslocados.

## Testes

`npm test` roda os testes de unidade (Vitest) do núcleo: cálculo de
sobreposição de horários (anti-conflito), faixas da agenda e permissões.
