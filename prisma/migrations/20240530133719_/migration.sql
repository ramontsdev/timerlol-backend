/*
  Warnings:

  - You are about to drop the column `settings_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `settingsId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_settings_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "settings_id",
ADD COLUMN     "settingsId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
