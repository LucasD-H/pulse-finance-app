import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { ensureAuthenticated } from "./auth.js";

function createRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe("ensureAuthenticated", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it("retorna 401 quando não há header Authorization", () => {
    const req = { headers: {} } as Request;
    const res = createRes();
    const next = vi.fn();

    ensureAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 quando o token está mal formatado (sem 'Bearer ')", () => {
    const req = { headers: { authorization: "tokensemprefixo" } } as Request;
    const res = createRes();
    const next = vi.fn();

    ensureAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 quando o token é inválido", () => {
    const req = { headers: { authorization: "Bearer token-invalido" } } as Request;
    const res = createRes();
    const next = vi.fn();

    ensureAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("chama next() e injeta req.userId quando o token é válido", () => {
    const token = jwt.sign({ sub: "user-123" }, "test-secret");
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = createRes();
    const next = vi.fn();

    ensureAuthenticated(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.userId).toBe("user-123");
  });
});
