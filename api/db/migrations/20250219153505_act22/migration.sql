/*
  Warnings:

  - The primary key for the `user_rol` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "user_rol" DROP CONSTRAINT "user_rol_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_rol_pkey" PRIMARY KEY ("id");
