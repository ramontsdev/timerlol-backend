/*
  Warnings:

  - You are about to drop the `Logo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logo" DROP CONSTRAINT "Logo_user_id_fkey";

-- DropTable
DROP TABLE "Logo";

-- CreateTable
CREATE TABLE "logo" (
    "id" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "logo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "logo_user_id_key" ON "logo"("user_id");

-- AddForeignKey
ALTER TABLE "logo" ADD CONSTRAINT "logo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
