/*
  Warnings:

  - You are about to drop the `questios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `questios` DROP FOREIGN KEY `questios_author_id_fkey`;

-- DropTable
DROP TABLE `questios`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `tb_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tb_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_questios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `author_id` INTEGER NOT NULL,

    UNIQUE INDEX `tb_questios_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_questios` ADD CONSTRAINT `tb_questios_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `tb_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
