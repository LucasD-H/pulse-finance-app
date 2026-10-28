# PulseFinance

Dashboard financeiro full-stack para controle de receitas e despesas, com autenticação de usuários e métricas em tempo real.

Projeto construído para estudo prático de React, Next.js, Node.js e PostgreSQL.

## Stack

- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT
- **Frontend**: React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS v4, SWR
- **Infraestrutura**: Docker (PostgreSQL local)

## Estrutura do repositório

```
pulse-finance-app/
├── pulse-finance-api/   # API REST (Node.js + Express + Prisma)
└── pulse-finance-web/   # Aplicação web (Next.js)
```

## Como rodar o projeto localmente

### 1. Backend (API)

```bash
cd pulse-finance-api
npm install
docker compose up -d        # sobe o PostgreSQL local
npx prisma migrate dev      # aplica as migrações
npm run dev                 # inicia a API em http://localhost:3001
```

Crie um arquivo `.env` em `pulse-finance-api/` com:

```
DATABASE_URL="postgresql://root:password@localhost:5432/pulsefinance?schema=public"
JWT_SECRET="sua-chave-secreta-aqui"
```

### 2. Frontend (web)

Com a API rodando em outro terminal:

```bash
cd pulse-finance-web
npm install
npm run dev                 # inicia o app em http://localhost:3000
```

Crie um arquivo `.env.local` em `pulse-finance-web/` com:

```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Acesse `http://localhost:3000`, crie uma conta e faça login para acessar o dashboard.

## Funcionalidades

- [x] Cadastro e autenticação de usuários (JWT)
- [x] CRUD de transações financeiras (receitas e despesas)
- [x] Dashboard com cards de resumo (saldo, entradas, saídas)
- [x] Tela de transações com criação e exclusão
- [x] Layout dark com sidebar e efeito glassmorphism
- [ ] Gráfico de evolução financeira (Recharts)
- [ ] Filtros por período, tipo e categoria
- [ ] Relatórios e exportações

## Design

Tema dark nativo com cards em efeito glassmorphism (fundo translúcido + blur) e cor de destaque emerald. Sidebar fixa para navegação entre Dashboard, Transações, Relatórios e Configurações.
