/*
  Warnings:

  - You are about to drop the column `descripcion` on the `despliegues` table. All the data in the column will be lost.
  - You are about to drop the column `respaldo` on the `despliegues` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `usuario_roles` table. All the data in the column will be lost.
  - You are about to drop the column `respaldo` on the `usuario_roles` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `usuario_roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "despliegues" DROP COLUMN "descripcion",
DROP COLUMN "respaldo";

-- AlterTable
ALTER TABLE "usuario_roles" DROP COLUMN "descripcion",
DROP COLUMN "respaldo",
DROP COLUMN "tipo";
