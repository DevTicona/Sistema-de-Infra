-- AlterTable
ALTER TABLE "servidores" ADD COLUMN     "id_cuchilla" INTEGER;

-- CreateTable
CREATE TABLE "cuchillas" (
    "id" SERIAL NOT NULL,
    "id_rack" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "posicion_slot" INTEGER,
    "estado" "estado" NOT NULL DEFAULT 'ACTIVO',
    "metadata" JSONB,
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "servidores_blade_pk" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "racks" (
    "id" SERIAL NOT NULL,
    "id_data_center" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "ubicacion" VARCHAR(200),
    "capacidad_en_u" INTEGER,
    "estado" "estado" NOT NULL DEFAULT 'ACTIVO',
    "_fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_usuario_creacion" INTEGER NOT NULL,
    "_fecha_modificacion" TIMESTAMPTZ(6),
    "_usuario_modificacion" INTEGER,

    CONSTRAINT "racks_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "servidores" ADD CONSTRAINT "fk_servidores_cuchillas" FOREIGN KEY ("id_cuchilla") REFERENCES "cuchillas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuchillas" ADD CONSTRAINT "fk_blade_rack" FOREIGN KEY ("id_rack") REFERENCES "racks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "racks" ADD CONSTRAINT "fk_racks_data_centers" FOREIGN KEY ("id_data_center") REFERENCES "data_centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
