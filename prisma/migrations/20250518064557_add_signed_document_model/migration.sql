-- CreateTable
CREATE TABLE "signed_documents" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "filename" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "signed_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "signed_documents_hash_key" ON "signed_documents"("hash");
