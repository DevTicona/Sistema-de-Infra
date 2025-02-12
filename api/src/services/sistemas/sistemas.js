import { db } from 'src/lib/db'

export const sistemas = () => {
  return db.sistemas.findMany()
}

export const sistema = ({ id }) => {
  return db.sistemas.findUnique({
    where: { id },
  })
}

export const createSistema = ({ input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.sistemas.create({
    data: {
      id_padre: input.id_padre,
      id_entidad: input.id_entidad,
      codigo: input.codigo,
      sigla: input.sigla,
      nombre: input.nombre,
      descripcion: input.descripcion,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: respaldoData,
      usuario_creacion: input.usuario_creacion,
      usuario_modificacion: input.usuario_modificacion,
      fecha_creacion: new Date(),
      fecha_modificacion: new Date(),
    },
  })
}

export const updateSistema = ({ id, input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.sistemas.update({
    data: {
      id_padre: input.id_padre,
      id_entidad: input.id_entidad,
      codigo: input.codigo,
      sigla: input.sigla,
      nombre: input.nombre,
      descripcion: input.descripcion,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: respaldoData,
      usuario_creacion: input.usuario_creacion,
      usuario_modificacion: input.usuario_modificacion,
      fecha_modificacion: new Date(),
    },
    where: { id },
  })
}

export const deleteSistema = async ({ id }) => {
  // Elimina registros dependientes en otras tablas
  await db.componentes.deleteMany({ where: { id_sistema: id } })
  await db.usuario_roles.deleteMany({ where: { id_sistema: id } })
  await db.sistemas.updateMany({
    where: { id_padre: id },
    data: { id_padre: null },
  }) // Rompe relación recursiva

  // Ahora sí, eliminar el sistema
  return db.sistemas.delete({ where: { id } })
}

export const Sistema = {
  componentes: (_obj, { root }) => {
    return db.sistemas.findUnique({ where: { id: root?.id } }).componentes()
  },
  entidades: (_obj, { root }) => {
    return db.sistemas.findUnique({ where: { id: root?.id } }).entidades()
  },
  sistemas: (_obj, { root }) => {
    return db.sistemas.findUnique({ where: { id: root?.id } }).sistemas()
  },
  other_sistemas: (_obj, { root }) => {
    return db.sistemas.findUnique({ where: { id: root?.id } }).other_sistemas()
  },
  usuario_roles: (_obj, { root }) => {
    return db.sistemas.findUnique({ where: { id: root?.id } }).usuario_roles()
  },
}
