/*
  Warnings:

  - Made the column `settings_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_settings_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "settings_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
