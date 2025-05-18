/*
  Warnings:

  - You are about to drop the column `user_id` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_user_id_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "user_id";

-- DropTable
DROP TABLE "users";
