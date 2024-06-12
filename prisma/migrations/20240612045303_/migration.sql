-- CreateTable
CREATE TABLE "Logo" (
    "id" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "Logo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Logo_user_id_key" ON "Logo"("user_id");

-- AddForeignKey
ALTER TABLE "Logo" ADD CONSTRAINT "Logo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
