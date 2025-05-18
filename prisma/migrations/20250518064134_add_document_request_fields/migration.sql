/*
  Warnings:

  - You are about to drop the column `filename` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `documents` table. All the data in the column will be lost.
  - Added the required column `documentType` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdfUrl` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userNik` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "documents_hash_key";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "filename",
DROP COLUMN "hash",
DROP COLUMN "signature",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "documentType" TEXT NOT NULL,
ADD COLUMN     "pdfUrl" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER,
ADD COLUMN     "userName" TEXT NOT NULL,
ADD COLUMN     "userNik" TEXT NOT NULL;
