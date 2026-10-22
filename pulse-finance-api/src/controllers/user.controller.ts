import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

export async function create(req: Request, res: Response) {
  const parsed = createUserSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const { name, email, password } = parsed.data;

  const userAlreadyExists = await prisma.user.findUnique({ where: { email } });

  if (userAlreadyExists) {
    return res.status(409).json({ message: "E-mail já cadastrado" });
  }

  const passwordHash = await bcrypt.hash(password, 8);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  // nunca devolvemos o passwordHash na resposta
  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}

const authenticateSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function authenticate(req: Request, res: Response) {
  const parsed = authenticateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
