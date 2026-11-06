import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { userRoutes } from "./routes/user.routes.js";
import { transactionRoutes } from "./routes/transaction.routes.js";

export const app = express();

app.use(helmet());

// Em produção, defina CORS_ORIGIN com a URL do frontend (ex: o domínio da
// Vercel). Sem a variável, libera tudo — conveniente em dev, mas não é o
// ideal para produção.
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));

app.use(express.json({ limit: "10kb" }));

// Limite geral, para mitigar abuso/DoS simples.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Limite mais rígido nas rotas de autenticação, para dificultar força
// bruta de senha e spam de cadastros.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas tentativas. Tente novamente mais tarde." },
});

app.use("/users", authLimiter);
app.use("/sessions", authLimiter);

app.use(userRoutes);
app.use(transactionRoutes);

// Express 5 já encaminha erros de rotas async para cá automaticamente.
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  },
);
