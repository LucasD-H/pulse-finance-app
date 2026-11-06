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
# Opcional: restringe o CORS à URL do frontend (sem isso, libera qualquer origem)
CORS_ORIGIN="http://localhost:3000"
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

## Segurança

Decisões e mitigações aplicadas:

- **Senhas**: hash com `bcrypt` (custo 10), nunca armazenadas nem retornadas em texto puro.
- **Autenticação**: JWT assinado, validado em todas as rotas de transações via middleware.
- **Autorização**: toda consulta/alteração de transação filtra por `userId`, prevenindo que um usuário acesse dados de outro (IDOR).
- **Rate limiting**: limite geral de requisições por IP, e um limite mais rígido em `/users` e `/sessions` para dificultar força bruta e spam de cadastro.
- **Helmet**: cabeçalhos HTTP de segurança (CSP, `X-Content-Type-Options`, `X-Frame-Options`, etc.) no backend.
- **CORS configurável**: via `CORS_ORIGIN`, para restringir em produção quem pode chamar a API.
- **Validação de entrada**: todos os bodies são validados com `zod` antes de tocar o banco.
- **CSV Injection**: campos de texto livre (título/categoria) são sanitizados antes da exportação, para que não sejam interpretados como fórmula ao abrir no Excel/Sheets.
- **Variáveis obrigatórias**: a API falha rápido na inicialização se `DATABASE_URL` ou `JWT_SECRET` não estiverem definidas, em vez de falhar de forma confusa na primeira requisição.

Limitações conhecidas (aceitáveis para um projeto de estudo, mas a evitar em produção real):

- O JWT é guardado no `localStorage` do navegador, o que o expõe a roubo via XSS. Em produção, o ideal é um cookie `httpOnly` emitido pelo próprio backend.
- `npm audit` no backend acusa uma vulnerabilidade em `deepmerge-ts`, dependência transitiva da **CLI** do Prisma (`@prisma/config`) — não faz parte do código que roda em produção nem é alcançável via HTTP. Corrigi-la exigiria migrar para uma versão ainda instável (release candidate) do Prisma.

## Possíveis próximos passos

- Edição de transações existentes (hoje só é possível criar e excluir)
- Paginação/infinite scroll na lista de transações
- Testes automatizados (unitários no backend, E2E no frontend)
- Deploy (ex: Vercel para o frontend, Railway/Fly.io para API + Postgres)
