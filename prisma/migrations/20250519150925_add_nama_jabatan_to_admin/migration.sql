/*
  Warnings:

  - You are about to drop the column `name` on the `admins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "name",
ADD COLUMN     "jabatan" TEXT,
ADD COLUMN     "nama" TEXT;
