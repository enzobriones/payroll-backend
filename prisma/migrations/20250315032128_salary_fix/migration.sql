/*
  Warnings:

  - You are about to alter the column `baseSalary` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "baseSalary" SET DATA TYPE INTEGER;
