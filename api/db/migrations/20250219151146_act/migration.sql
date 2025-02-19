/*
  Warnings:

  - You are about to drop the column `roles` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_rol" DROP CONSTRAINT "user_rol_roleId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "roles";
