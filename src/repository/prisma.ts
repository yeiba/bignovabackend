import { PrismaClient } from "@prisma/client";
import config from "../config";

const globalFromPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalFromPrisma.prisma || new PrismaClient({ log: ["query"] });

if (config.NODE_ENV !== "production") globalFromPrisma.prisma = prisma;
