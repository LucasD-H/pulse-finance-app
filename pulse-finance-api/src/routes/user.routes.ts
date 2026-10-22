import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

export const userRoutes = Router();

userRoutes.post("/users", userController.create);
userRoutes.post("/sessions", userController.authenticate);
