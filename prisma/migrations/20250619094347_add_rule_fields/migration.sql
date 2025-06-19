-- AlterTable
ALTER TABLE "Rule" ADD COLUMN "condition" TEXT;
ALTER TABLE "Rule" ADD COLUMN "operator" TEXT;
ALTER TABLE "Rule" ADD COLUMN "thenAction" TEXT;
ALTER TABLE "Rule" ADD COLUMN "value" TEXT;
