-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "end_round_warning_time" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "number_rounds" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "rest_time" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "round_time" INTEGER NOT NULL DEFAULT 180;