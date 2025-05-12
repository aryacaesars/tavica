-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "filename" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_hash_key" ON "documents"("hash");
