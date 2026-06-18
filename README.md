# Stile · Sistema de Agendamento para Barbearia

Sistema full stack de agendamento para a barbearia **Stile**: o cliente agenda
serviços (corte, barba, sobrancelha, progressiva) e a barbearia gerencia a
agenda, sem conflito de horário. Next.js 15 (App Router) + TypeScript, Prisma,
Auth.js e Tailwind.

> 📚 **Trabalho acadêmico (Engenharia de Software):** veja
> [`APRESENTACAO_ACADEMICA.md`](APRESENTACAO_ACADEMICA.md) (documento completo) e
> [`RESUMO_APRESENTACAO.md`](RESUMO_APRESENTACAO.md) (roteiro de apresentação).

## Stack

- **Next.js 15 / React 19 / TypeScript** — front + back no mesmo projeto
- **Prisma** — ORM e migrations (SQLite no dev, PostgreSQL em produção)
- **Auth.js (NextAuth v5)** — login por e-mail/senha (Credentials)
- **Tailwind CSS** — identidade visual premium + animações discretas
- **Resend** — notificações por e-mail (com fallback de log no dev)
- **Zod** — validação ponta a ponta

## Pré-requisitos

- **Node.js 20 LTS** (ou superior) e **npm**
- **Git**
- Não precisa instalar banco de dados: o ambiente de desenvolvimento usa
  **SQLite** (um arquivo local criado automaticamente).

## Como clonar e rodar (desenvolvimento)

```bash
# 1. Clonar o repositório
git clone https://github.com/Educosta2405/barbearia-stile.git
cd barbearia-stile

# 2. Instalar as dependências
npm install

# 3. Criar o arquivo .env a partir do exemplo
cp .env.example .env        # Windows (PowerShell/cmd): copy .env.example .env

# 4. Criar o banco SQLite e aplicar as migrations
npm run db:migrate

# 5. Popular dados de exemplo (serviços, admin e barbeiros)
npm run db:seed

# 6. Iniciar o projeto
npm run dev                 # abre em http://localhost:3000
```

> O `.env.example` já vem pronto para desenvolvimento (SQLite). Não é preciso
> editar nada para rodar localmente.

### Acessos de teste (criados pelo seed)

| Papel    | E-mail                  | Senha       |
| -------- | ----------------------- | ----------- |
| Admin    | admin@barbearia.dev     | admin123    |
| Barbeiro | rafael@barbearia.dev    | barber123   |
| Barbeiro | marcos@barbearia.dev    | barber123   |

Clientes criam a própria conta em `/cadastro`.

### Rotas principais

| Rota              | Tela                          | Acesso          |
| ----------------- | ----------------------------- | --------------- |
| `/`               | Home (apresentação)           | Público         |
| `/login`          | Entrar                        | Público         |
| `/cadastro`       | Criar conta                   | Público         |
| `/agendar`        | Fluxo de agendamento          | Cliente logado  |
| `/perfil`         | Meus horários (cliente)       | Cliente logado  |
| `/admin`          | Painel / agenda               | Barbeiro/Admin  |
| `/admin/servicos` | Gestão de serviços            | Barbeiro/Admin  |
| `/admin/barbeiros`| Gestão de barbeiros           | Barbeiro/Admin  |
| `/admin/clientes` | Lista de clientes             | Barbeiro/Admin  |

### Verificar qualidade (opcional)

```bash
npm run typecheck   # checagem de tipos (TypeScript)
npm test            # testes de unidade do núcleo (Vitest)
npm run build       # build de produção
```

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
