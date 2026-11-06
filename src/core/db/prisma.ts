import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isDev =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "development";

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDev ? ["query", "error", "warn"] : ["error"],
  });

if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
