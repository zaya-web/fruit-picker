-- Add tenant ownership columns (idempotent for DBs that already have them via seed)

ALTER TABLE "Worker" ADD COLUMN IF NOT EXISTS "userId" INTEGER;
ALTER TABLE "Fruit" ADD COLUMN IF NOT EXISTS "userId" INTEGER;

-- Backfill from the earliest user when possible
UPDATE "Worker"
SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1)
WHERE "userId" IS NULL
  AND EXISTS (SELECT 1 FROM "User");

UPDATE "Fruit"
SET "userId" = (SELECT "id" FROM "User" ORDER BY "id" ASC LIMIT 1)
WHERE "userId" IS NULL
  AND EXISTS (SELECT 1 FROM "User");

-- Enforce NOT NULL only when every row is backed by a user
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Worker" WHERE "userId" IS NULL)
     OR EXISTS (SELECT 1 FROM "Fruit" WHERE "userId" IS NULL) THEN
    RAISE NOTICE 'Skipping NOT NULL/FK: orphan Worker/Fruit rows still missing userId';
    RETURN;
  END IF;

  ALTER TABLE "Worker" ALTER COLUMN "userId" SET NOT NULL;
  ALTER TABLE "Fruit" ALTER COLUMN "userId" SET NOT NULL;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Worker_userId_fkey'
  ) THEN
    ALTER TABLE "Worker"
      ADD CONSTRAINT "Worker_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Fruit_userId_fkey'
  ) THEN
    ALTER TABLE "Fruit"
      ADD CONSTRAINT "Fruit_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  CREATE INDEX IF NOT EXISTS "Worker_userId_idx" ON "Worker"("userId");
  CREATE INDEX IF NOT EXISTS "Fruit_userId_idx" ON "Fruit"("userId");
END $$;
