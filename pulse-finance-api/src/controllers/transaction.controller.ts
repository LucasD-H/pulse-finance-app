import { z } from "zod";
import type { Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD");

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  // O limite máximo (1000) existe para o dashboard/relatórios poderem pedir
  // "tudo" em uma chamada só para montar gráficos/exportações, sem abrir mão
  // de um teto que evite uma única requisição trazer o banco inteiro.
  limit: z.coerce.number().int().min(1).max(1000).default(10),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().min(1).optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
});

export async function list(req: Request, res: Response) {
  const parsed = listQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const { page, limit, type, category, startDate, endDate } = parsed.data;

  const where: Prisma.TransactionWhereInput = { userId: req.userId };

  if (type) where.type = type;
  if (category) where.category = category;

  if (startDate || endDate) {
    where.date = {
      ...(startDate ? { gte: new Date(`${startDate}T00:00:00.000Z`) } : {}),
      ...(endDate ? { lte: new Date(`${endDate}T23:59:59.999Z`) } : {}),
    };
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return res.json({
    data: transactions,
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
}

export async function listCategories(req: Request, res: Response) {
  // Independe dos filtros/paginação: alimenta o dropdown de categorias
  // com todas as categorias já usadas pelo usuário.
  const rows = await prisma.transaction.findMany({
    where: { userId: req.userId },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return res.json(rows.map((row) => row.category));
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
