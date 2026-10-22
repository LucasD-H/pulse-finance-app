import { PrismaClient } from "@prisma/client";

// Em dev, o tsx watch recarrega o módulo a cada alteração de arquivo.
// Sem esse cache global, cada reload criaria uma nova instância do
// PrismaClient (e uma nova pool de conexões), esgotando as conexões
// disponíveis do Postgres rapidamente.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
