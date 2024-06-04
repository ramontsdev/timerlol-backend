-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('active', 'canceled', 'processing', 'pending');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('pt_br', 'en');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "settings_id" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "status" "BillingStatus" NOT NULL,
    "subscription_external_id" TEXT NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "billing_frequency" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "plan_external_id" TEXT NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" UUID NOT NULL,
    "enble_date_hours" BOOLEAN NOT NULL,
    "enble_sound_alert" BOOLEAN NOT NULL,
    "enable_vibration" BOOLEAN NOT NULL,
    "enable_preparation_time" BOOLEAN NOT NULL,
    "number_rounds" INTEGER NOT NULL DEFAULT 3,
    "rest_time" INTEGER NOT NULL DEFAULT 60,
    "round_time" INTEGER NOT NULL DEFAULT 180,
    "end_round_warning_time" INTEGER NOT NULL DEFAULT 10,
    "language" "Language" NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
