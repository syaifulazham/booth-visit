/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Visitor` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `Visitor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Visitor_phone_key` ON `Visitor`;

-- AlterTable
ALTER TABLE `Visitor` MODIFY `age` INTEGER NULL,
    MODIFY `visitorType` VARCHAR(191) NULL,
    MODIFY `sektor` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `state` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Visitor_email_key` ON `Visitor`(`email`);
