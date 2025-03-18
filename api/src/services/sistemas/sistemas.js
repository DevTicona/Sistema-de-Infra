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
    tipo_respaldo: input.tipo_respaldo,
    detalle_respaldo: input.detalle_respaldo,
    fecha_solicitud: input.fecha_solicitud,
    responsable_admin: input.responsable_admin,
  }

  return db.sistemas.create({
    data: {
      id_padre: input.id_padre,
      id_entidad: input.id_entidad,
      codigo: input.codigo,
      sigla: input.sigla,
      nombre: input.nombre,
      descripcion: input.descripcion,
      estado: input.estado,
      respaldo_creacion: respaldoData,
      usuario_creacion: input.usuario_creacion,
      fecha_creacion: new Date(),
    },
  })
}

export const updateSistema = ({ id, input }) => {
  const respaldoData = {
    tipo_respaldo: input.tipo_respaldo,
    detalle_respaldo: input.detalle_respaldo,
    fecha_solicitud: input.fecha_solicitud,
    responsable_admin: input.responsable_admin,
  }

  return db.sistemas.update({
    data: {
      id_padre: input.id_padre,
      id_entidad: input.id_entidad,
      codigo: input.codigo,
      sigla: input.sigla,
      nombre: input.nombre,
      descripcion: input.descripcion,
      estado: input.estado,
      respaldo_creacion: respaldoData,
      usuario_modificacion: input.usuario_modificacion,
      fecha_modificacion: new Date(),
    },
    where: { id },
  })
}

export const deleteSistema = ({ id }) => {
  return db.sistemas.delete({
    where: { id },
  })
}

export const sistemasCount = ({ where }) => {
  return db.sistemas.count({ where })
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
