/*
  Warnings:

  - Added the required column `type` to the `HealthPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HealthPlan" ADD COLUMN     "type" "HealthType" NOT NULL;
