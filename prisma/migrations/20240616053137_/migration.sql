/*
  Warnings:

  - You are about to drop the `logo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "logo" DROP CONSTRAINT "logo_user_id_fkey";

-- DropTable
DROP TABLE "logo";

-- CreateTable
CREATE TABLE "logos" (
    "id" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "logos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "logos_user_id_key" ON "logos"("user_id");

-- AddForeignKey
ALTER TABLE "logos" ADD CONSTRAINT "logos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
