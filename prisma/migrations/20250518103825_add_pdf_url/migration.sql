/*
  Warnings:

  - Added the required column `pdfUrl` to the `signed_documents` table without a default value. This is not possible if the table is not empty.

*/
-- First add the column as nullable
ALTER TABLE "signed_documents" ADD COLUMN "pdfUrl" TEXT;

-- Update existing rows with empty string
UPDATE "signed_documents" SET "pdfUrl" = '';

-- Now make the column not nullable with default value
ALTER TABLE "signed_documents" ALTER COLUMN "pdfUrl" SET NOT NULL;
ALTER TABLE "signed_documents" ALTER COLUMN "pdfUrl" SET DEFAULT '';
