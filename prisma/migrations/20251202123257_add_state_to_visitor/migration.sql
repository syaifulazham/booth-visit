/*
  Warnings:

  - Added the required column `state` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add column with default value first, then remove default
ALTER TABLE `Visitor` ADD COLUMN `state` VARCHAR(191) NOT NULL DEFAULT 'SELANGOR';

-- Update existing rows to have a state value (if needed)
UPDATE `Visitor` SET `state` = 'SELANGOR' WHERE `state` = '';

-- Remove default value (to match schema)
ALTER TABLE `Visitor` ALTER COLUMN `state` DROP DEFAULT;
