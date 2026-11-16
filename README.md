# PulseFinance

Dashboard financeiro full-stack para controle de receitas e despesas, com autenticação de usuários, métricas em tempo real, filtros, paginação e relatórios.

Projeto construído para estudo prático de React, Next.js, Node.js e PostgreSQL.

🔗 **Demo em produção**: [pulse-finance-app.vercel.app](https://pulse-finance-app.vercel.app)
🔗 **API**: [pulse-finance-api.onrender.com](https://pulse-finance-api.onrender.com) ([health check](https://pulse-finance-api.onrender.com/health))

> A API roda no plano free do Render, que hiberna após alguns minutos sem uso. A primeira requisição depois de um tempo parado pode demorar ~30-50s para "acordar" o serviço — é normal, não é bug.

## Stack

- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT
- **Frontend**: React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS v4, SWR, Recharts
- **Testes**: Vitest (backend), Playwright (E2E no frontend)
- **Infraestrutura**: Docker (Postgres local) · Neon (Postgres em produção) · Render (API) · Vercel (frontend)

## Estrutura do repositório

```
pulse-finance-app/
├── render.yaml          # Blueprint de deploy da API no Render
├── pulse-finance-api/    # API REST (Node.js + Express + Prisma)
└── pulse-finance-web/    # Aplicação web (Next.js)
```

## Como rodar o projeto localmente

### 1. Backend (API)

```bash
cd pulse-finance-api
npm install                 # roda "prisma generate" automaticamente (postinstall)
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
# Opcional: limite de tentativas de login/cadastro por IP a cada 15 min (padrão: 10).
# Em dev, e principalmente ao rodar os testes E2E, suba bastante esse valor.
AUTH_RATE_LIMIT_MAX=1000
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

## Testes

```bash
# Backend — testes unitários/integração (Vitest, Prisma mockado, não precisa de banco)
cd pulse-finance-api
npm test

# Frontend — testes E2E (Playwright). Precisa do backend + Postgres já rodando
cd pulse-finance-web
npm run test:e2e
```

## Funcionalidades

- [x] Cadastro e autenticação de usuários (JWT)
- [x] CRUD completo de transações financeiras (criar, editar, excluir)
- [x] Paginação e filtros (tipo, categoria, período) resolvidos no backend
- [x] Dashboard com cards de resumo (saldo, entradas, saídas)
- [x] Layout dark com sidebar e efeito glassmorphism
- [x] Gráfico de evolução financeira mensal (Recharts)
- [x] Relatórios com distribuição por categoria (gráfico de rosca) e exportação em CSV
- [x] Testes automatizados (Vitest no backend, Playwright E2E no frontend)
- [x] Deploy em produção (Vercel + Render + Neon)

## Design

Tema dark nativo com cards em efeito glassmorphism (fundo translúcido + blur) e cor de destaque emerald. Sidebar fixa para navegação entre Dashboard, Transações, Relatórios e Configurações.

## Deploy

| Camada | Provedor | Observação |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Root Directory = `pulse-finance-web`; env var `NEXT_PUBLIC_API_URL` |
| API | [Render](https://render.com) | Deploy via Blueprint (`render.yaml` na raiz do repo) |
| Banco de dados | [Neon](https://neon.tech) | Postgres serverless; connection string vai em `DATABASE_URL` no Render |

O `render.yaml` define o build (`npm install --include=dev && npx prisma generate && npm run build`) e o start (`npx prisma migrate deploy && npm run start`), além de um health check em `/health`. O `--include=dev` é necessário porque `NODE_ENV=production` faz o `npm install` pular `devDependencies` por padrão — e é lá que estão o TypeScript e a CLI do Prisma, usados só durante o build.

## Segurança

Decisões e mitigações aplicadas:

- **Senhas**: hash com `bcrypt` (custo 10), nunca armazenadas nem retornadas em texto puro.
- **Autenticação**: JWT assinado, validado em todas as rotas de transações via middleware.
- **Autorização**: toda consulta/alteração de transação filtra por `userId`, prevenindo que um usuário acesse dados de outro (IDOR) — coberto por testes automatizados.
- **Rate limiting**: limite geral de requisições por IP, e um limite mais rígido (configurável via `AUTH_RATE_LIMIT_MAX`) em `/users` e `/sessions` para dificultar força bruta e spam de cadastro.
- **Helmet**: cabeçalhos HTTP de segurança (CSP, `X-Content-Type-Options`, `X-Frame-Options`, etc.) no backend.
- **CORS configurável**: via `CORS_ORIGIN`, restringindo em produção quem pode chamar a API (só o domínio da Vercel).
- **Validação de entrada**: todos os bodies e query params são validados com `zod` antes de tocar o banco.
- **CSV Injection**: campos de texto livre (título/categoria) são sanitizados antes da exportação, para que não sejam interpretados como fórmula ao abrir no Excel/Sheets.
- **Variáveis obrigatórias**: a API falha rápido na inicialização se `DATABASE_URL` ou `JWT_SECRET` não estiverem definidas, em vez de falhar de forma confusa na primeira requisição.

Limitações conhecidas (aceitáveis para um projeto de estudo, mas a evitar em produção real):

- O JWT é guardado no `localStorage` do navegador, o que o expõe a roubo via XSS. Em produção, o ideal é um cookie `httpOnly` emitido pelo próprio backend.
- `npm audit` no backend acusa uma vulnerabilidade em `deepmerge-ts`, dependência transitiva da **CLI** do Prisma (`@prisma/config`) — não faz parte do código que roda em produção nem é alcançável via HTTP. Corrigi-la exigiria migrar para uma versão ainda instável (release candidate) do Prisma.

## Possíveis próximos passos

- Cookies `httpOnly` no lugar de JWT em `localStorage`
- Mais testes E2E (edição de transação, filtros, paginação)
- CI (GitHub Actions) rodando os testes a cada push
- Domínio customizado
