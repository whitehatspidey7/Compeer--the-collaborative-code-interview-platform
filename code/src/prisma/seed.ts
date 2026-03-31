import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma_client = new PrismaClient({ adapter });

async function Dummy_user() {
  // creating a user if it doesn't exist already.
  const test_user = await prisma_client.user.upsert({
    where: { email: "test@email.com" },
    update: {},
    create: {
      email: "spiderman@gmail.com",
      name: "peter",
      passwordHash: "12ew3rfgdg4re"
    }
  });

  console.log(test_user);
  console.log("✅ Seeded 1 test user. Use this ID in your dashboard.");
}

async function main() {
  try {
    await Dummy_user();
  } catch (e) {
    console.error("❌ Seeding failed:", e);
    throw e;
  } finally {
    await prisma_client.$disconnect();
  }
}

main();