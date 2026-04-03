import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// This tells TypeScript that there might be a 'prisma' property on the global object
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. We check if a prisma instance already exists globally.
// 2. If not, we create a new one. 
// 3. We log queries in development so you can see the SQL in your terminal.
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 4. In development, save the instance to the global object.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db; 