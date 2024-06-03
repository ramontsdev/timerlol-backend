/*
  Warnings:

  - Added the required column `status` to the `plans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('active', 'canceled', 'processing', 'pending');

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "status" "BillingStatus" NOT NULL;
