-- CreateTable
CREATE TABLE "componentes" (
    "id" SERIAL NOT NULL,
    "id_sistema" INTEGER NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
    "entorno" VARCHAR(10) NOT NULL,
    "categoria" VARCHAR(15) NOT NULL,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "componente_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contenedor_logico" (
    "id" SERIAL NOT NULL,
    "id_padre" INTEGER,
    "codigo" VARCHAR(10) NOT NULL,
    "sigla" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
    "respaldo" JSONB,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "contenedor_logico_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despliegue" (
    "id" SERIAL NOT NULL,
    "id_componente" INTEGER,
    "id_contenedor_logico" INTEGER NOT NULL,
    "sigla" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
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
    "nombre" VARCHAR(50) NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
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
    "estado" VARCHAR(15) NOT NULL,
    "respaldo" JSONB,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "roles_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servidor_contenedor" (
    "id" SERIAL NOT NULL,
    "id_servidor" INTEGER,
    "id_contenedor_logico" INTEGER,
    "sigla" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
    "respaldo" JSONB,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "servidor_contenedor_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servidores" (
    "id" SERIAL NOT NULL,
    "nro_cluster" INTEGER NOT NULL,
    "vmid" INTEGER NOT NULL,
    "nombre" VARCHAR(35) NOT NULL,
    "nodo" VARCHAR(20) NOT NULL,
    "ip" VARCHAR(15) NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
    "respaldo" JSONB,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

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
    "tipo" VARCHAR(15) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
    "respaldo" JSONB,
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
    "id_contenedor_logico" INTEGER NOT NULL,
    "id_sistema" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
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
    "estado" VARCHAR(15) NOT NULL,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "usuario_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "componentes" ADD CONSTRAINT "fk_sistema_id" FOREIGN KEY ("id_sistema") REFERENCES "sistemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "despliegue" ADD CONSTRAINT "fk_componente_id" FOREIGN KEY ("id_componente") REFERENCES "componentes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "despliegue" ADD CONSTRAINT "fk_contenedor_logico_2_id" FOREIGN KEY ("id_contenedor_logico") REFERENCES "contenedor_logico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "servidor_contenedor" ADD CONSTRAINT "fk_contenedor_logico_id" FOREIGN KEY ("id_contenedor_logico") REFERENCES "contenedor_logico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "servidor_contenedor" ADD CONSTRAINT "fk_servidor_id" FOREIGN KEY ("id_servidor") REFERENCES "servidores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sistemas" ADD CONSTRAINT "fk_entidad_id" FOREIGN KEY ("id_entidad") REFERENCES "entidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sistemas" ADD CONSTRAINT "fk_sistema_padre_id" FOREIGN KEY ("id_padre") REFERENCES "sistemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "fk_contenedor_logico_3_id" FOREIGN KEY ("id_contenedor_logico") REFERENCES "contenedor_logico"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "fk_rol_id" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "fk_sistema_2_id" FOREIGN KEY ("id_sistema") REFERENCES "sistemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "fk_usuario_id" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
