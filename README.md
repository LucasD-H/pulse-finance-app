# PulseFinance

Dashboard financeiro full-stack para controle de receitas e despesas, com autenticação de usuários e métricas em tempo real.

Projeto construído para estudo prático de React, Next.js, Node.js e PostgreSQL.

## Stack

- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT
- **Frontend**: React, Next.js (em desenvolvimento)
- **Infraestrutura**: Docker (PostgreSQL local)

## Estrutura do repositório

```
pulse-finance-app/
├── pulse-finance-api/   # API REST (Node.js + Express + Prisma)
└── pulse-finance-web/   # Aplicação web (Next.js) — em breve
```

## Como rodar o backend localmente

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

## Funcionalidades

- [x] Cadastro e autenticação de usuários (JWT)
- [x] CRUD de transações financeiras (receitas e despesas)
- [ ] Dashboard com métricas e gráficos (frontend)
- [ ] Filtros por período, tipo e categoria
