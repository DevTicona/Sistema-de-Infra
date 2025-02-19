import { db } from 'src/lib/db'

export const despliegues = () => {
  return db.despliegue.findMany()
}

export const despliegue = ({ id }) => {
  return db.despliegue.findUnique({
    where: { id },
  })
}

export const createDespliegue = ({ input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.despliegue.create({
    data: {
      id_componente: input.id_componente,
      id_contenedor_logico: input.id_contenedor_logico,
      sigla: input.sigla,
      nombre: input.nombre,
      descripcion: input.descripcion,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: respaldoData,
      fecha_creacion: new Date(),
      usuario_creacion: input.usuario_creacion,
    },
  })
}

export const updateDespliegue = ({ id, input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.despliegue.update({
    data: {
      id_componente: input.id_componente,
      id_contenedor_logico: input.id_contenedor_logico,
      sigla: input.sigla,
      nombre: input.nombre,
      descripcion: input.descripcion,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: respaldoData,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
    where: { id },
  })
}

export const deleteDespliegue = ({ id }) => {
  return db.despliegue.delete({
    where: { id },
  })
}

export const Despliegue = {
  componentes: (_obj, { root }) => {
    return db.despliegue.findUnique({ where: { id: root?.id } }).componentes()
  },
  contenedor_logico: (_obj, { root }) => {
    return db.despliegue
      .findUnique({ where: { id: root?.id } })
      .contenedor_logico()
  },
}
