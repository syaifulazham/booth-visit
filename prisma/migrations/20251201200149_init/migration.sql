-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booth` (
    `id` VARCHAR(191) NOT NULL,
    `boothName` VARCHAR(191) NOT NULL,
    `ministry` VARCHAR(191) NOT NULL,
    `agency` VARCHAR(191) NOT NULL,
    `abbreviationName` VARCHAR(191) NOT NULL,
    `picName` VARCHAR(191) NULL,
    `picPhone` VARCHAR(191) NULL,
    `picEmail` VARCHAR(191) NULL,
    `hashcode` VARCHAR(191) NOT NULL,
    `qrCodeGenerated` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Booth_hashcode_key`(`hashcode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visitor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `visitorType` VARCHAR(191) NOT NULL,
    `sektor` VARCHAR(191) NOT NULL,
    `cookieId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Visitor_cookieId_key`(`cookieId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visit` (
    `id` VARCHAR(191) NOT NULL,
    `visitorId` VARCHAR(191) NOT NULL,
    `boothId` VARCHAR(191) NOT NULL,
    `visitedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,

    INDEX `Visit_boothId_idx`(`boothId`),
    INDEX `Visit_visitorId_idx`(`visitorId`),
    INDEX `Visit_visitedAt_idx`(`visitedAt`),
    UNIQUE INDEX `Visit_visitorId_boothId_key`(`visitorId`, `boothId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `Visitor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_boothId_fkey` FOREIGN KEY (`boothId`) REFERENCES `Booth`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
