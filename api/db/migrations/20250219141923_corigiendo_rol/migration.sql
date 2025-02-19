/*
  Warnings:

  - You are about to drop the `user_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_userId_fkey";

-- DropTable
DROP TABLE "user_role";

-- CreateTable
CREATE TABLE "user_rol" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "user_rol_pkey" PRIMARY KEY ("userId","roleId")
);

-- AddForeignKey
ALTER TABLE "user_rol" ADD CONSTRAINT "user_rol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rol" ADD CONSTRAINT "user_rol_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
