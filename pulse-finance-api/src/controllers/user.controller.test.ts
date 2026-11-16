import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const { prisma } = await import("../lib/prisma.js");
const userController = await import("./user.controller.js");

function createRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.JWT_SECRET = "test-secret";
});

describe("create (cadastro)", () => {
  it("retorna 400 quando o body é inválido", async () => {
    const req = { body: { name: "A", email: "nao-e-email", password: "123" } } as Request;
    const res = createRes();

    await userController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retorna 409 quando o e-mail já existe", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "1" } as never);

    const req = {
      body: { name: "Lucas", email: "lucas@test.com", password: "12345678" },
    } as Request;
    const res = createRes();

    await userController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("cria o usuário com a senha em hash e não devolve o hash na resposta", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "1",
      name: "Lucas",
      email: "lucas@test.com",
      passwordHash: "hash-fake",
    } as never);

    const req = {
      body: { name: "Lucas", email: "lucas@test.com", password: "12345678" },
    } as Request;
    const res = createRes();

    await userController.create(req, res);

    const createCall = vi.mocked(prisma.user.create).mock.calls[0]?.[0] as {
      data: { passwordHash: string };
    };

    expect(createCall.data.passwordHash).not.toBe("12345678");
    expect(await bcrypt.compare("12345678", createCall.data.passwordHash)).toBe(true);

    expect(res.status).toHaveBeenCalledWith(201);
    const jsonArg = vi.mocked(res.json).mock.calls[0]?.[0];
    expect(jsonArg).not.toHaveProperty("passwordHash");
  });
});

describe("authenticate (login)", () => {
  it("retorna 401 quando o usuário não existe", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const req = { body: { email: "x@x.com", password: "123456" } } as Request;
    const res = createRes();

    await userController.authenticate(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("retorna 401 quando a senha está incorreta", async () => {
    const passwordHash = await bcrypt.hash("senha-correta", 4);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "1",
      email: "x@x.com",
      passwordHash,
    } as never);

    const req = { body: { email: "x@x.com", password: "senha-errada" } } as Request;
    const res = createRes();

    await userController.authenticate(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("retorna um token quando as credenciais estão corretas", async () => {
    const passwordHash = await bcrypt.hash("senha-correta", 4);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "1",
      name: "Lucas",
      email: "x@x.com",
      passwordHash,
    } as never);

    const req = { body: { email: "x@x.com", password: "senha-correta" } } as Request;
    const res = createRes();

    await userController.authenticate(req, res);

    const jsonArg = vi.mocked(res.json).mock.calls[0]?.[0] as { token: string };
    expect(typeof jsonArg.token).toBe("string");
  });
});
