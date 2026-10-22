import { z } from "zod";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function list(req: Request, res: Response) {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.userId },
    orderBy: { date: "desc" },
  });

  return res.json(transactions);
}

const createTransactionSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1),
  date: z.coerce.date().optional(),
});

export async function create(req: Request, res: Response) {
  const parsed = createTransactionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const transaction = await prisma.transaction.create({
    data: {
      ...parsed.data,
      userId: req.userId!,
    },
  });

  return res.status(201).json(transaction);
}

const updateTransactionSchema = createTransactionSchema.partial();

export async function update(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Id inválido" });
  }

  const parsed = updateTransactionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  // garante que a transação pertence ao usuário autenticado antes de alterar
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId: req.userId },
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transação não encontrada" });
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data: parsed.data,
  });

  return res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Id inválido" });
  }

  const transaction = await prisma.transaction.findFirst({
    where: { id, userId: req.userId },
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transação não encontrada" });
  }

  await prisma.transaction.delete({ where: { id } });

  return res.status(204).send();
}
