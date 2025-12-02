/*
  Warnings:

  - A unique constraint covering the columns `[boothNumber]` on the table `Booth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Booth_boothNumber_key` ON `Booth`(`boothNumber`);
