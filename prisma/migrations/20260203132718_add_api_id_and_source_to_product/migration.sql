/*
  Warnings:

  - A unique constraint covering the columns `[apiId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "apiId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Product_apiId_key" ON "Product"("apiId");
