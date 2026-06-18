# Stile — Roteiro de Apresentação (1 página)

**Projeto:** Sistema web de agendamento para a barbearia **Stile**
**Disciplina:** Engenharia de Software · **Repositório:** github.com/Educosta2405/barbearia-stile

---

### 1. Abertura (30s)
"Nosso projeto é a **Stile**, um sistema de agendamento online para uma
barbearia. O objetivo foi aplicar, na prática, os conceitos de Engenharia de
Software — dos requisitos até a implantação."

### 2. Problema e solução (40s)
- **Problema:** barbearias marcam horário por WhatsApp/caderno → conflito de
  horário, retrabalho e falta de organização.
- **Solução:** um site onde o **cliente agenda sozinho** e a barbearia
  **organiza a agenda em um só lugar**, sem dois clientes no mesmo horário.

### 3. O que o sistema faz (40s) — *mostrar na tela*
- Cliente: cria conta, **agenda** (serviço → barbeiro → data → horário),
  cancela, reagenda e vê o histórico.
- Barbeiro/Admin: **painel** com agenda (dia/semana/mês), bloqueio de horários,
  status dos atendimentos e gestão de serviços e barbeiros.

### 4. Decisões de Engenharia de Software (1min) — *o coração da nota*
- **Requisitos:** 15 funcionais + 7 não funcionais + regras de negócio.
- **Modelagem:** casos de uso (Cliente, Barbeiro, Admin) e banco relacional
  (User, Barber, Service, Appointment, TimeOff).
- **Arquitetura em camadas:** tela → regra de negócio → banco (fácil de manter).
- **Regra crítica (anti-overbooking):** o banco tem uma trava + o sistema
  confere o horário em **transação** → impossível marcar dois no mesmo horário.
- **Segurança:** senhas com **hash**, áreas de admin **protegidas** por papel.
- **Testes:** regras principais têm **testes automatizados** (`npm test`).

### 5. Tecnologias (20s)
Next.js + TypeScript (telas e backend), Prisma + banco (SQLite nos testes,
PostgreSQL em produção), Auth.js (login) — escolhidas por serem modernas,
gratuitas e simples de publicar.

### 6. Implantação e evolução (20s)
- **Deploy:** Vercel + PostgreSQL (Neon/Supabase), publicando direto do GitHub.
- **Evolução futura:** lembrete por WhatsApp, pagamento online, relatórios.

### 7. Fechamento honesto sobre IA (20s)
"Usamos **ferramentas de IA como apoio** para escrever o código mais rápido —
assim como se faz no mercado hoje. Mas as **decisões de engenharia, a modelagem
e o entendimento do sistema são nossos**. O foco do trabalho foi **pensar como
engenheiros de software**, não apenas fazer funcionar."

---

**Demonstração ao vivo (ordem sugerida):**
`/` (home) → `/cadastro` ou `/login` → `/agendar` (fazer um agendamento) →
mostrar o **conflito** tentando o mesmo horário → entrar como admin em `/admin`.

**Logins de teste:** admin `admin@barbearia.dev` / `admin123` · barbeiro
`rafael@barbearia.dev` / `barber123`.
