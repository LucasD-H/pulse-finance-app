import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

export const transactionRoutes = Router();

// toda rota abaixo passa primeiro pelo ensureAuthenticated
transactionRoutes.use(ensureAuthenticated);

transactionRoutes.get("/transactions", transactionController.list);
transactionRoutes.post("/transactions", transactionController.create);
transactionRoutes.put("/transactions/:id", transactionController.update);
transactionRoutes.delete("/transactions/:id", transactionController.remove);
