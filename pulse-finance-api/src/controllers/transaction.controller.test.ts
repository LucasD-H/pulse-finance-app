import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    transaction: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const { prisma } = await import("../lib/prisma.js");
const transactionController = await import("./transaction.controller.js");

function createRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("list", () => {
  it("usa página/limite padrão e filtra por userId", async () => {
    vi.mocked(prisma.transaction.findMany).mockResolvedValue([]);
    vi.mocked(prisma.transaction.count).mockResolvedValue(0);

    const req = { query: {}, userId: "user-1" } as unknown as Request;
    const res = createRes();

    await transactionController.list(req, res);

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1" },
        skip: 0,
        take: 10,
      }),
    );
    expect(res.json).toHaveBeenCalledWith({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    });
  });

  it("rejeita limit acima do máximo permitido", async () => {
    const req = { query: { limit: "5000" }, userId: "user-1" } as unknown as Request;
    const res = createRes();

    await transactionController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("aplica filtros de tipo/categoria e calcula o skip pela página", async () => {
    vi.mocked(prisma.transaction.findMany).mockResolvedValue([]);
    vi.mocked(prisma.transaction.count).mockResolvedValue(0);

    const req = {
      query: { type: "INCOME", category: "Trabalho", page: "2", limit: "5" },
      userId: "user-1",
    } as unknown as Request;
    const res = createRes();

    await transactionController.list(req, res);

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1", type: "INCOME", category: "Trabalho" },
        skip: 5,
        take: 5,
      }),
    );
  });
});

describe("create", () => {
  it("associa a transação ao usuário autenticado", async () => {
    vi.mocked(prisma.transaction.create).mockResolvedValue({ id: "t1" } as never);

    const req = {
      body: { title: "Mercado", amount: 100, type: "EXPENSE", category: "Alimentação" },
      userId: "user-1",
    } as unknown as Request;
    const res = createRes();

    await transactionController.create(req, res);

    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "user-1" }),
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("retorna 400 para payload inválido", async () => {
    const req = { body: { title: "" }, userId: "user-1" } as unknown as Request;
    const res = createRes();

    await transactionController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("update", () => {
  it("retorna 404 quando a transação não pertence ao usuário (IDOR)", async () => {
    vi.mocked(prisma.transaction.findFirst).mockResolvedValue(null);

    const req = {
      params: { id: "t1" },
      body: { title: "Novo título" },
      userId: "user-1",
    } as unknown as Request;
    const res = createRes();

    await transactionController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(prisma.transaction.update).not.toHaveBeenCalled();
  });

  it("atualiza quando a transação pertence ao usuário", async () => {
    vi.mocked(prisma.transaction.findFirst).mockResolvedValue({ id: "t1" } as never);
    vi.mocked(prisma.transaction.update).mockResolvedValue({
      id: "t1",
      title: "Novo",
    } as never);

    const req = {
      params: { id: "t1" },
      body: { title: "Novo" },
      userId: "user-1",
    } as unknown as Request;
    const res = createRes();

    await transactionController.update(req, res);

    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { title: "Novo" },
    });
    expect(res.json).toHaveBeenCalledWith({ id: "t1", title: "Novo" });
  });
});

describe("remove", () => {
  it("retorna 404 quando a transação não pertence ao usuário (IDOR)", async () => {
    vi.mocked(prisma.transaction.findFirst).mockResolvedValue(null);

    const req = { params: { id: "t1" }, userId: "user-1" } as unknown as Request;
    const res = createRes();

    await transactionController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(prisma.transaction.delete).not.toHaveBeenCalled();
  });

  it("deleta e retorna 204 quando a transação pertence ao usuário", async () => {
    vi.mocked(prisma.transaction.findFirst).mockResolvedValue({ id: "t1" } as never);

    const req = { params: { id: "t1" }, userId: "user-1" } as unknown as Request;
    const res = createRes();

    await transactionController.remove(req, res);

    expect(prisma.transaction.delete).toHaveBeenCalledWith({ where: { id: "t1" } });
    expect(res.status).toHaveBeenCalledWith(204);
  });
});

describe("listCategories", () => {
  it("retorna uma lista simples de strings", async () => {
    vi.mocked(prisma.transaction.findMany).mockResolvedValue([
      { category: "Trabalho" },
      { category: "Lazer" },
    ] as never);

    const req = { userId: "user-1" } as unknown as Request;
    const res = createRes();

    await transactionController.listCategories(req, res);

    expect(res.json).toHaveBeenCalledWith(["Trabalho", "Lazer"]);
  });
});
