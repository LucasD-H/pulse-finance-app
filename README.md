# PulseFinance

Dashboard financeiro full-stack para controle de receitas e despesas, com autenticação de usuários, métricas em tempo real, filtros e relatórios.

Projeto construído para estudo prático de React, Next.js, Node.js e PostgreSQL.

## Stack

- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT
- **Frontend**: React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS v4, SWR, Recharts
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
- [x] Gráfico de evolução financeira mensal (Recharts)
- [x] Filtros por período, tipo e categoria na tela de transações
- [x] Relatórios com distribuição por categoria (gráfico de rosca) e exportação em CSV

## Design

Tema dark nativo com cards em efeito glassmorphism (fundo translúcido + blur) e cor de destaque emerald. Sidebar fixa para navegação entre Dashboard, Transações, Relatórios e Configurações.

## Possíveis próximos passos

- Edição de transações existentes (hoje só é possível criar e excluir)
- Paginação/infinite scroll na lista de transações
- Testes automatizados (unitários no backend, E2E no frontend)
- Deploy (ex: Vercel para o frontend, Railway/Fly.io para API + Postgres)
