import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomBytes, scryptSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv() {
  try {
    const text = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const i = trimmed.indexOf('=');
      if (i === -1) continue;
      const key = trimmed.slice(0, i).trim();
      let value = trimmed.slice(i + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

loadEnv();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Worker" ADD COLUMN IF NOT EXISTS "userId" INTEGER;
  `);
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Fruit" ADD COLUMN IF NOT EXISTS "userId" INTEGER;
  `);

  const email = 'zaya6369@gmail.com';
  const passwordHash = hashPassword('zaya123');

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: 'Zaya', passwordHash },
    create: { name: 'Zaya', email, passwordHash },
  });

  await prisma.$executeRaw`
    UPDATE "Worker" SET "userId" = ${user.id}
  `;
  await prisma.$executeRaw`
    UPDATE "Fruit" SET "userId" = ${user.id}
  `;

  await prisma.$executeRawUnsafe(
    `ALTER TABLE "Worker" ALTER COLUMN "userId" SET NOT NULL`,
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "Fruit" ALTER COLUMN "userId" SET NOT NULL`,
  );

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      ALTER TABLE "Worker"
        ADD CONSTRAINT "Worker_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      ALTER TABLE "Fruit"
        ADD CONSTRAINT "Fruit_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "Worker_userId_idx" ON "Worker"("userId")`,
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "Fruit_userId_idx" ON "Fruit"("userId")`,
  );

  const workers = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS count FROM "Worker" WHERE "userId" = ${user.id}
  `;
  const fruits = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS count FROM "Fruit" WHERE "userId" = ${user.id}
  `;

  console.log(
    JSON.stringify(
      {
        ok: true,
        user: { id: user.id, name: user.name, email: user.email },
        password: 'zaya123',
        workers: workers[0]?.count,
        fruits: fruits[0]?.count,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
