/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Visitor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Visitor` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Visitor_phone_key` ON `Visitor`(`phone`);
