import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não enviado" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Token mal formatado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
    };

    req.userId = payload.sub;

    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
