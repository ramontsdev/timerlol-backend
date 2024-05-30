/*
  Warnings:

  - You are about to drop the column `planId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `settingsId` on the `users` table. All the data in the column will be lost.
  - Added the required column `settings_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_planId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_settingsId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "planId",
DROP COLUMN "settingsId",
ADD COLUMN     "plan_id" UUID,
ADD COLUMN     "settings_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
