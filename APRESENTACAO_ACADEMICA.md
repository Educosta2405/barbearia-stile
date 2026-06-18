# Stile — Sistema de Agendamento para Barbearia
### Trabalho da disciplina de Engenharia de Software

> Documento de apresentação acadêmica do projeto **Stile**, um sistema web de
> agendamento online para uma barbearia. O objetivo deste documento é mostrar
> como os conceitos de Engenharia de Software foram aplicados na prática:
> levantamento de requisitos, modelagem, arquitetura, testes, implantação e
> manutenção.

**Curso:** Análise e Desenvolvimento de Sistemas
**Tipo de software:** Aplicação web (full stack)
**Repositório:** https://github.com/Educosta2405/barbearia-stile

---

## Sumário
1. [Contextualização do projeto](#1-contextualização-do-projeto)
2. [Engenharia de requisitos](#2-engenharia-de-requisitos)
3. [Modelagem do sistema](#3-modelagem-do-sistema)
4. [Protótipos (telas)](#4-protótipos-telas)
5. [Projeto da solução](#5-projeto-da-solução)
6. [Plano de testes](#6-plano-de-testes)
7. [Implantação e manutenção](#7-implantação-e-manutenção)
8. [Gerenciamento do projeto](#8-gerenciamento-do-projeto)
9. [Backlog ágil](#9-backlog-ágil)
10. [Reflexão individual (base)](#10-reflexão-individual-base)
11. [Como apresentar ao professor](#como-apresentar-ao-professor)

---

## 1. Contextualização do projeto

### 1.1 Apresentação do cliente
A **Stile** é uma barbearia que atende clientes para serviços como corte de
cabelo, barba, sobrancelha e progressiva. A barbearia tem mais de um
profissional (barbeiros) e um responsável pela administração do negócio (o
dono/gerente).

### 1.2 Problema identificado
Hoje muitas barbearias ainda marcam horário por **telefone, WhatsApp ou
caderninho**. Isso gera alguns problemas no dia a dia:

- Dois clientes marcam, sem querer, o **mesmo horário** com o mesmo barbeiro
  (conflito de agenda / *overbooking*);
- O cliente não consegue ver os horários livres sozinho, dependendo sempre de
  alguém para responder;
- O barbeiro perde tempo organizando a agenda manualmente;
- Faltam dados organizados sobre os atendimentos (quem veio, quando, quanto).

### 1.3 Objetivos do sistema
**Objetivo geral:** permitir que o cliente agende um horário pela internet,
de forma rápida, e que a barbearia organize sua agenda em um só lugar.

**Objetivos específicos:**
- Mostrar os serviços, os barbeiros e os horários disponíveis;
- Deixar o cliente criar conta, agendar, cancelar e reagendar sozinho;
- Impedir que dois agendamentos ocupem o mesmo horário;
- Dar ao dono/barbeiro um painel para ver a agenda e gerenciar o negócio;
- Enviar uma confirmação por e-mail ao cliente.

### 1.4 Justificativa da solução
Um sistema de agendamento online resolve o problema porque **centraliza** a
agenda, **automatiza** a verificação de horários livres e **evita conflitos**.
Optou-se por uma **aplicação web** (e não um app de celular) porque ela funciona
em qualquer aparelho com navegador, é mais barata de manter e mais simples de
publicar — adequada para o porte de uma barbearia e para um projeto acadêmico.

---

## 2. Engenharia de requisitos

Requisitos são tudo aquilo que o sistema **precisa fazer** (funcionais) e as
**qualidades** que ele deve ter (não funcionais).

### 2.1 Atores envolvidos
| Ator | Quem é | O que faz no sistema |
|------|--------|----------------------|
| **Cliente** | Pessoa que quer cortar o cabelo | Cria conta, agenda, cancela, reagenda, vê seu histórico |
| **Barbeiro** | Profissional da barbearia | Vê a agenda, confirma/conclui atendimentos, bloqueia horários |
| **Administrador** | Dono/gerente | Tudo do barbeiro + gerencia serviços, barbeiros e clientes |
| **Sistema de e-mail** | Serviço externo (Resend) | Envia a confirmação ao cliente |

### 2.2 Requisitos Funcionais (RF)
| Código | Requisito |
|--------|-----------|
| **RF01** | O sistema deve permitir que o cliente **crie uma conta** com nome, e-mail e senha. |
| **RF02** | O sistema deve permitir **login e logout** com e-mail e senha. |
| **RF03** | O sistema deve permitir que o cliente **escolha um serviço** (corte, barba, sobrancelha ou progressiva). |
| **RF04** | O sistema deve permitir que o cliente **escolha o barbeiro**. |
| **RF05** | O sistema deve **calcular e exibir os horários livres** de um barbeiro em uma data, considerando a duração do serviço. |
| **RF06** | O sistema deve permitir que o cliente **confirme um agendamento**. |
| **RF07** | O sistema deve permitir que o cliente **cancele** um agendamento. |
| **RF08** | O sistema deve permitir que o cliente **reagende** um horário existente. |
| **RF09** | O sistema deve permitir que o cliente **veja seu histórico** de agendamentos. |
| **RF10** | O sistema deve permitir que o barbeiro/admin **veja a agenda** por dia, semana e mês. |
| **RF11** | O sistema deve permitir que o admin **gerencie serviços** (criar, editar, ativar/desativar). |
| **RF12** | O sistema deve permitir que o admin **gerencie barbeiros** (cadastrar e ativar/desativar). |
| **RF13** | O sistema deve permitir que o barbeiro **bloqueie horários** (folga, almoço). |
| **RF14** | O sistema deve permitir **alterar o status** do atendimento (confirmar, concluir, faltou, cancelar). |
| **RF15** | O sistema deve **enviar e-mail de confirmação** ao cliente após o agendamento. |

### 2.3 Requisitos Não Funcionais (RNF)
| Código | Requisito | Tipo |
|--------|-----------|------|
| **RNF01** | As senhas devem ser **guardadas com criptografia** (hash), nunca em texto puro. | Segurança |
| **RNF02** | Áreas restritas (`/admin`) só podem ser acessadas por barbeiro/admin. | Segurança |
| **RNF03** | O sistema deve ser **responsivo** (funcionar bem em celular e computador). | Usabilidade |
| **RNF04** | As telas devem carregar rápido e ter **feedback visual** (carregando, sucesso, erro). | Desempenho/Usabilidade |
| **RNF05** | O sistema **nunca** deve permitir dois agendamentos no mesmo horário com o mesmo barbeiro. | Confiabilidade |
| **RNF06** | O código deve ser **organizado em camadas** para facilitar manutenção. | Manutenibilidade |
| **RNF07** | O sistema deve poder migrar de **SQLite (testes) para PostgreSQL (produção)** sem reescrever as regras. | Portabilidade |

### 2.4 Regras de negócio (RN)
| Código | Regra |
|--------|-------|
| **RN01** | Cada serviço tem uma **duração em minutos**; o horário final é calculado a partir dela. |
| **RN02** | Um barbeiro **não pode** ter dois atendimentos sobrepostos no tempo (anti-overbooking). |
| **RN03** | Não é possível agendar em cima de um **horário bloqueado** (folga/almoço). |
| **RN04** | Só é possível agendar dentro do **horário de funcionamento** da barbearia. |
| **RN05** | É preciso respeitar uma **antecedência mínima** (não dá para marcar para "agora"). |
| **RN06** | Um cliente só pode **cancelar ou reagendar o próprio** agendamento; o staff pode mexer em qualquer um. |
| **RN07** | Serviços e barbeiros são **desativados**, não apagados, para preservar o histórico. |

---

## 3. Modelagem do sistema

### 3.1 Descrição do diagrama de casos de uso
O diagrama de casos de uso mostra **quem** usa o sistema (atores) e **o que**
cada um pode fazer (casos de uso). No Stile temos três atores principais —
**Cliente**, **Barbeiro** e **Administrador** — ligados às ações que conseguem
realizar. O Administrador "herda" o que o Barbeiro faz e ainda tem ações
exclusivas de gestão.

```
            ┌─────────────────────── Sistema Stile ───────────────────────┐
            │                                                              │
  Cliente ──┤ Criar conta · Fazer login · Agendar horário                 │
            │ Cancelar agendamento · Reagendar · Ver histórico            │
            │                                                              │
  Barbeiro ─┤ Ver agenda (dia/semana/mês) · Confirmar/Concluir atendimento│
            │ Marcar falta · Bloquear horário                             │
            │                                                              │
   Admin ───┤ (tudo do Barbeiro) + Gerenciar serviços ·                   │
            │ Gerenciar barbeiros · Visualizar clientes                   │
            └──────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ (envia e-mail)
                          Serviço externo de e-mail
```

### 3.2 Lista dos principais casos de uso
- **UC01 – Criar conta**
- **UC02 – Fazer login / logout**
- **UC03 – Agendar horário** (escolher serviço → barbeiro → data → horário → confirmar)
- **UC04 – Cancelar agendamento**
- **UC05 – Reagendar agendamento**
- **UC06 – Consultar histórico de agendamentos**
- **UC07 – Visualizar agenda (dia/semana/mês)** — barbeiro/admin
- **UC08 – Gerenciar serviços** — admin
- **UC09 – Gerenciar barbeiros** — admin
- **UC10 – Bloquear horário** — barbeiro/admin
- **UC11 – Alterar status do atendimento** — barbeiro/admin

### 3.3 Especificação das funcionalidades principais

**UC03 – Agendar horário** (caso de uso central)
- **Ator:** Cliente (precisa estar logado)
- **Pré-condição:** ter conta e estar autenticado
- **Fluxo principal:**
  1. O cliente escolhe um **serviço**;
  2. Escolhe um **barbeiro** que atende aquele serviço;
  3. Escolhe a **data**;
  4. O sistema mostra os **horários livres** daquele dia;
  5. O cliente escolhe o horário e **confirma**;
  6. O sistema **valida** se o horário continua livre (sem conflito);
  7. O agendamento é salvo e um **e-mail de confirmação** é enviado.
- **Fluxo alternativo:** se, na confirmação, o horário já tiver sido ocupado por
  outra pessoa, o sistema avisa e pede para escolher outro horário.
- **Pós-condição:** agendamento criado com status "Pendente".

**UC11 – Alterar status do atendimento**
- **Ator:** Barbeiro/Admin
- **Fluxo:** na agenda, o staff seleciona um agendamento e muda o status para
  **Confirmado**, **Concluído**, **Faltou** ou **Cancelado**.

---

## 4. Protótipos (telas)

As telas abaixo já existem no sistema funcionando. A coluna "Rota" indica o
endereço (URL) que representa cada tela.

| # | Tela | Rota | Descrição |
|---|------|------|-----------|
| 1 | **Login** | `/login` | Entrada do usuário com e-mail e senha. |
| 2 | **Tela principal (Home)** | `/` | Página de apresentação da barbearia: serviços, barbeiros, diferenciais e acesso rápido. |
| 3 | **Cadastro** | `/cadastro` | Criação de conta do cliente. |
| 4 | **Agendamento** | `/agendar` | Fluxo em etapas: serviço → barbeiro → data → horário → confirmação. |
| 5 | **Consulta do cliente** | `/perfil` | Histórico do cliente, com opções de cancelar e reagendar. |
| 6 | **Painel administrativo** | `/admin` | Agenda (dia/semana/mês) e cards de resumo (hoje, pendentes, concluídos, bloqueados). |
| 7 | **Gestão de serviços** | `/admin/servicos` | Criar/editar serviços e preços. |
| 8 | **Gestão de barbeiros** | `/admin/barbeiros` | Cadastrar e ativar/desativar barbeiros. |
| 9 | **Clientes** | `/admin/clientes` | Lista de clientes cadastrados. |

> **Observação:** as rotas `/agendar`, `/perfil` e `/admin` são **protegidas** —
> exigem login. As de `/admin` exigem perfil de barbeiro ou administrador.

---

## 5. Projeto da solução

### 5.1 Arquitetura proposta
O sistema usa uma arquitetura **full stack em camadas**, com um único projeto
que contém o frontend e o backend (modelo *monolito moderno*). A separação por
responsabilidades facilita a manutenção:

- **Apresentação (telas):** componentes visuais reutilizáveis;
- **Ações do servidor / API:** recebem os pedidos do usuário;
- **Regras de negócio (services):** onde ficam as regras de agendamento;
- **Acesso ao banco (ORM):** conversa com o banco de dados;
- **Validação e autenticação:** garantem dados corretos e acesso seguro.

### 5.2 Tecnologias utilizadas (explicadas de forma simples)
| Tecnologia | O que é | Por que foi usada |
|------------|---------|-------------------|
| **Next.js + React** | Ferramenta para criar sites e telas modernas | Junta frontend e backend em um só projeto |
| **TypeScript** | JavaScript com "tipos" (avisa erros antes de rodar) | Deixa o código mais seguro e fácil de entender |
| **Tailwind CSS** | Biblioteca de estilos | Monta telas bonitas e responsivas mais rápido |
| **Prisma (ORM)** | Tradutor entre o código e o banco de dados | Evita escrever SQL na mão e cria as tabelas |
| **SQLite / PostgreSQL** | Bancos de dados | SQLite para testar; PostgreSQL para produção |
| **Auth.js (NextAuth)** | Biblioteca de login | Cuida de sessão, senha e permissões |
| **Zod** | Validador de dados | Confere se os dados recebidos estão corretos |
| **Resend** | Serviço de envio de e-mail | Manda a confirmação para o cliente |
| **Vitest** | Ferramenta de testes | Testa as regras principais do sistema |

### 5.3 Diagrama textual da solução
```
   [ Navegador do usuário ]
            │  (clica em "Agendar")
            ▼
   ┌──────────────────────────────┐
   │  FRONTEND (telas em React)    │  → mostra serviços, barbeiros, horários
   └──────────────┬───────────────┘
                  │ envia o pedido
                  ▼
   ┌──────────────────────────────┐
   │  BACKEND (Next.js)            │
   │  • Autenticação (quem é?)     │
   │  • Validação (dados ok?)      │
   │  • Regras de negócio          │  → calcula horários, evita conflito
   └──────────────┬───────────────┘
                  │ usa o ORM (Prisma)
                  ▼
   ┌──────────────────────────────┐
   │  BANCO DE DADOS               │  → guarda usuários, serviços,
   │  (SQLite / PostgreSQL)        │     barbeiros e agendamentos
   └──────────────────────────────┘
                  │
                  ▼
        [ E-mail de confirmação ]
```

### 5.4 Explicação de frontend, backend e banco de dados
- **Frontend** é a parte que o usuário **vê e clica**: as telas de login,
  agendamento e painel. Ele mostra as informações e envia os pedidos.
- **Backend** é o **cérebro** que não aparece: recebe os pedidos, confere quem
  está logado, valida os dados, aplica as regras (como "não pode marcar em
  horário ocupado") e responde.
- **Banco de dados** é onde tudo fica **guardado** de forma permanente:
  usuários, serviços, barbeiros e agendamentos. Mesmo que o site reinicie, os
  dados continuam lá.

### 5.5 Principais entidades do banco
- **User** — usuário (com papel: CLIENTE, BARBEIRO ou ADMIN)
- **Barber** — perfil do barbeiro
- **Service** — serviço (nome, duração, preço)
- **Appointment** — agendamento (cliente, barbeiro, serviço, horário, status)
- **TimeOff** — horário bloqueado (folga/almoço)
- **Notification** — registro dos e-mails enviados

---

## 6. Plano de testes

| ID | Cenário | Procedimento | Resultado esperado |
|----|---------|--------------|--------------------|
| **CT01** | Login com dados corretos | Abrir `/login`, informar e-mail e senha válidos e clicar em "Entrar" | Usuário é autenticado e redirecionado (cliente → `/agendar`, admin → `/admin`) |
| **CT02** | Login com senha errada | Abrir `/login`, informar e-mail certo e senha errada | O sistema **nega** o acesso e mostra "E-mail ou senha incorretos" |
| **CT03** | Agendamento com sucesso | Logar como cliente, escolher serviço → barbeiro → data → horário livre → confirmar | Agendamento é criado e aparece a tela de **"Agendamento confirmado"** |
| **CT04** | Conflito de horário (anti-overbooking) | Tentar agendar um horário que **já está ocupado** com o mesmo barbeiro | O sistema **bloqueia** e avisa que o horário não está mais disponível |
| **CT05** | Reagendar para horário bloqueado | Reagendar um atendimento para um horário marcado como **folga/almoço** | O sistema **rejeita** e mantém o horário anterior |
| **CT06** | Acesso indevido ao admin | Logar como **cliente** e tentar abrir `/admin` | O sistema **redireciona** o cliente para fora da área administrativa |
| **CT07** | Cancelamento de agendamento | Em `/perfil`, clicar em "Cancelar" em um agendamento futuro | O agendamento muda para o status **Cancelado** |

> **Observação:** parte das regras críticas (cálculo de sobreposição de
> horários, faixas de agenda e permissões) já possui **testes automatizados**
> com Vitest (`npm test`), reforçando o item CT04.

---

## 7. Implantação e manutenção

### 7.1 Estratégia de implantação
- **Banco de produção:** trocar o SQLite (usado nos testes) por **PostgreSQL**
  hospedado em um serviço gratuito (ex.: Neon ou Supabase);
- **Aplicação:** publicar na **Vercel** (plataforma que hospeda projetos
  Next.js com poucos cliques), conectada ao repositório do GitHub;
- **Configuração:** definir as variáveis de ambiente (banco, segredo de login,
  chave de e-mail e fuso horário `America/Sao_Paulo`);
- **Entrega contínua:** a cada novo envio (`push`) ao GitHub, a Vercel publica
  automaticamente a versão atualizada.

### 7.2 Estratégia de treinamento
- **Para o dono/barbeiro:** um guia rápido (1 página) com prints mostrando como
  ver a agenda, bloquear horários e mudar o status dos atendimentos;
- **Para o cliente:** a própria interface é simples e autoexplicativa; um vídeo
  curto (1–2 min) pode ser publicado nas redes da barbearia.

### 7.3 Manutenção corretiva
Corrige **erros** encontrados depois da entrega. Exemplos: ajustar um cálculo de
horário, corrigir um texto, resolver um problema de login. O GitHub guarda o
histórico, o que facilita encontrar e reverter mudanças.

### 7.4 Manutenção evolutiva
Adiciona **novas funcionalidades** com o tempo. Exemplos já mapeados:
- Lembrete automático por e-mail/WhatsApp 1 dia antes;
- Pagamento online (sinal/entrada);
- Relatórios financeiros para o dono;
- Avaliação do atendimento pelo cliente.

---

## 8. Gerenciamento do projeto

### 8.1 Cronograma simplificado
| Etapa | Atividade | Duração estimada |
|-------|-----------|------------------|
| 1 | Levantamento de requisitos e regras de negócio | 1 semana |
| 2 | Modelagem (casos de uso e banco de dados) | 1 semana |
| 3 | Desenvolvimento do backend e do banco | 2 semanas |
| 4 | Desenvolvimento das telas (frontend) | 2 semanas |
| 5 | Testes e correções | 1 semana |
| 6 | Documentação e implantação | 1 semana |

### 8.2 Principais riscos e mitigação
| Risco | Impacto | Estratégia de mitigação |
|-------|---------|-------------------------|
| Conflito de horário (overbooking) | Alto | Constraint no banco + verificação em transação + testes automatizados |
| Vazamento de senhas | Alto | Guardar senhas com hash; nunca versionar o arquivo `.env` |
| Horário errado por fuso (servidor UTC) | Médio | Definir `TZ=America/Sao_Paulo` na produção |
| Prazo curto do trabalho | Médio | Priorizar o essencial (MVP) e deixar extras para depois |
| Dependência de serviços externos (e-mail) | Baixo | Sistema funciona mesmo sem e-mail configurado (registra/loga) |

---

## 9. Backlog ágil

No método ágil, o trabalho é organizado em **Épicos** (grandes temas), que se
dividem em **Features** (funcionalidades) e depois em **Histórias de usuário**
(o que cada pessoa quer fazer, na visão dela).

### Épico 1 — Conta e acesso
- *Feature:* Cadastro e login
  - **História:** "Como **cliente**, quero **criar uma conta** para poder agendar."
  - **História:** "Como **usuário**, quero **fazer login** para acessar minhas informações."

### Épico 2 — Agendamento
- *Feature:* Fluxo de agendamento
  - **História:** "Como **cliente**, quero **ver os horários livres** para escolher o melhor para mim."
  - **História:** "Como **cliente**, quero **confirmar um horário** para garantir meu atendimento."
- *Feature:* Gestão do próprio agendamento
  - **História:** "Como **cliente**, quero **cancelar ou reagendar** caso eu não possa ir."
  - **História:** "Como **cliente**, quero **ver meu histórico** de atendimentos."

### Épico 3 — Operação da barbearia
- *Feature:* Agenda do profissional
  - **História:** "Como **barbeiro**, quero **ver minha agenda** por dia/semana/mês para me organizar."
  - **História:** "Como **barbeiro**, quero **bloquear horários** de folga/almoço."
  - **História:** "Como **barbeiro**, quero **marcar atendimentos** como confirmados/concluídos."

### Épico 4 — Administração
- *Feature:* Gestão do negócio
  - **História:** "Como **admin**, quero **cadastrar serviços e preços**."
  - **História:** "Como **admin**, quero **cadastrar barbeiros**."
  - **História:** "Como **admin**, quero **ver a lista de clientes**."

---

## 10. Reflexão individual (base)

> Esta seção é um **modelo** para você adaptar com a sua experiência real.
> Escreva com suas palavras — o professor valoriza honestidade.

### 10.1 Minha contribuição
Participei do **levantamento de requisitos**, da **modelagem** (casos de uso e
estrutura do banco), da definição das **regras de negócio** (como o anti-conflito
de horários) e da organização da **documentação** do projeto. Também acompanhei
a montagem da arquitetura em camadas e a definição do plano de testes.

### 10.2 Dificuldades encontradas
- Entender como **separar as camadas** (tela, regra de negócio e banco) sem
  misturar tudo;
- Compreender a regra para **evitar dois agendamentos no mesmo horário**;
- Lidar com **fuso horário** e cálculo de horários disponíveis.

### 10.3 Conhecimentos adquiridos
- Diferença entre **requisitos funcionais e não funcionais**;
- Como montar **casos de uso** e ligar atores às funcionalidades;
- Noções de **arquitetura em camadas** e de **banco de dados relacional**;
- Importância de **testes** e de **não versionar dados sensíveis** (`.env`).

### 10.4 Lições aprendidas
- Planejar antes de codar economiza tempo;
- Documentar ajuda a explicar o sistema para outras pessoas;
- Pensar nos **erros possíveis** (conflitos, acesso indevido) é parte essencial
  da Engenharia de Software, não só "fazer funcionar".

---

## Como apresentar ao professor

> Sugestão de fala curta e honesta para a apresentação:

"Este projeto é um **protótipo acadêmico** de um sistema de agendamento para a
barbearia Stile. Ele foi desenvolvido com **apoio de ferramentas de
Inteligência Artificial** para acelerar a escrita do código, mas o **foco do
nosso trabalho foi aplicar os conceitos de Engenharia de Software**: levantamento
de **requisitos**, **modelagem** (casos de uso e banco de dados), definição da
**arquitetura**, **plano de testes** e estratégias de **implantação e
manutenção**.

Mais do que apenas 'fazer funcionar', nos preocupamos em **entender as decisões**:
por que separar o sistema em camadas, como garantir que dois clientes não marquem
o mesmo horário, como proteger as senhas e as áreas administrativas, e como o
projeto poderia ir do ambiente de testes para produção. O código está
**versionado no GitHub**, e as regras mais críticas têm **testes automatizados**.
Usamos a IA como ferramenta de apoio — assim como um profissional usa hoje —, mas
as **decisões de engenharia e o entendimento do sistema são nossos**."

---

*Documento elaborado para fins acadêmicos — disciplina de Engenharia de Software.*
