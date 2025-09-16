-- CreateTable
CREATE TABLE "public"."produtos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "preco" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);
