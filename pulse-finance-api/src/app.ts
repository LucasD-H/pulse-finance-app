import express from "express";
import cors from "cors";
import { userRoutes } from "./routes/user.routes.js";
import { transactionRoutes } from "./routes/transaction.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

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
