-- CreateEnum
CREATE TYPE "categoria" AS ENUM ('Backend', 'Frontend', 'Database', 'NFS');

-- CreateEnum
CREATE TYPE "entorno" AS ENUM ('Demo', 'PreProd', 'Prod', 'Test');

-- CreateEnum
CREATE TYPE "estado" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateTable
CREATE TABLE "rol" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL DEFAULT '',
    "salt" TEXT NOT NULL DEFAULT '',
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_rol" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "user_rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "componentes" (
    "id" SERIAL NOT NULL,
    "id_sistema" INTEGER NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "estado" NOT NULL,
    "entorno" "entorno" NOT NULL,
    "categoria" "categoria" NOT NULL,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "componente_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despliegues" (
    "id" SERIAL NOT NULL,
    "id_componente" INTEGER,
    "id_servidor" INTEGER NOT NULL,
    "agrupador" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "estado" "estado" NOT NULL,
    "respaldo" JSONB,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "despliegue_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entidades" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "sigla" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "estado" "estado" NOT NULL,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "entidades_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(15) NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "estado" "estado" NOT NULL,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,
    "privilegios" JSON,

    CONSTRAINT "roles_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servidores" (
    "id" SERIAL NOT NULL,
    "nro_cluster" INTEGER NOT NULL,
    "vmid" INTEGER NOT NULL,
    "nombre" VARCHAR(35) NOT NULL,
    "nodo" VARCHAR(20) NOT NULL,
    "ip" INET NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "estado" "estado" NOT NULL,
    "metadata" JSONB,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,
    "id_data_center" INTEGER,

    CONSTRAINT "servidor_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sistemas" (
    "id" SERIAL NOT NULL,
    "id_padre" INTEGER,
    "id_entidad" INTEGER NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "sigla" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "estado" NOT NULL,
    "respaldo_creacion" JSONB,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "sistema_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "id_rol" INTEGER NOT NULL,
    "id_despliegue" INTEGER NOT NULL,
    "id_sistema" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "estado" "estado" NOT NULL,
    "respaldo" JSONB,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "usuario_roles_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "uuid_ciudadano" VARCHAR,
    "nombre_usuario" VARCHAR(20) NOT NULL,
    "profile" JSONB NOT NULL,
    "telefono" JSONB NOT NULL,
    "correo_electronico" JSONB NOT NULL,
    "estado" "estado" NOT NULL,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "usuario_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_centers" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "ubicacion" VARCHAR(200),
    "capacidad" INTEGER,
    "estado" "estado" NOT NULL DEFAULT 'ACTIVO',
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "data_centers_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rol_name_key" ON "rol"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_rol_unique" ON "user_rol"("userId", "roleId");

-- AddForeignKey
ALTER TABLE "user_rol" ADD CONSTRAINT "user_rol_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rol" ADD CONSTRAINT "user_rol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "componentes" ADD CONSTRAINT "fk_sistema_id" FOREIGN KEY ("id_sistema") REFERENCES "sistemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "despliegues" ADD CONSTRAINT "fk_componente_id" FOREIGN KEY ("id_componente") REFERENCES "componentes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "despliegues" ADD CONSTRAINT "fk_servidor_id" FOREIGN KEY ("id_servidor") REFERENCES "servidores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "servidores" ADD CONSTRAINT "fk_servidores_data_center" FOREIGN KEY ("id_data_center") REFERENCES "data_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sistemas" ADD CONSTRAINT "fk_entidad_id" FOREIGN KEY ("id_entidad") REFERENCES "entidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sistemas" ADD CONSTRAINT "fk_sistema_padre_id" FOREIGN KEY ("id_padre") REFERENCES "sistemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "fk_despliegue_id" FOREIGN KEY ("id_despliegue") REFERENCES "despliegues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "fk_rol_id" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "fk_sistema_2_id" FOREIGN KEY ("id_sistema") REFERENCES "sistemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "fk_usuario_id" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
