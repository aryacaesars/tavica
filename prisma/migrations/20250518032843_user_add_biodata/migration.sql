/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alamat` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nik` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noWa` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggalLahir` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "alamat" TEXT NOT NULL DEFAULT 'ISI_ALAMAT',
ADD COLUMN     "nik" TEXT NOT NULL DEFAULT '0000000000000000',
ADD COLUMN     "noWa" TEXT NOT NULL DEFAULT '081234567890',
ADD COLUMN     "tanggalLahir" TIMESTAMP(3) NOT NULL DEFAULT '2000-01-01T00:00:00.000Z';

-- CreateIndex
CREATE UNIQUE INDEX "User_nik_key" ON "User"("nik");
