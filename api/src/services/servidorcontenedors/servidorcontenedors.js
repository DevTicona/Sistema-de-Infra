import { db } from 'src/lib/db'

export const servidorcontenedors = () => {
  return db.servidor_contenedor.findMany()
}

export const servidorcontenedor = ({ id }) => {
  return db.servidor_contenedor.findUnique({
    where: { id },
  })
}

export const createServidorcontenedor = ({ input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.servidor_contenedor.create({
    data: {
      id_servidor: input.id_servidor,
      id_contenedor_logico: input.id_contenedor_logico,
      sigla: input.sigla,
      nombre: input.nombre,
      descripcion: input.descripcion,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: respaldoData,
      fecha_creacion: new Date(),
      usuario_creacion: input.usuario_creacion,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
  })
}

export const updateServidorcontenedor = ({ id, input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.servidor_contenedor.update({
    data: {
      id_servidor: input.id_servidor,
      id_contenedor_logico: input.id_contenedor_logico,
      sigla: input.sigla,
      nombre: input.nombre,
      descripcion: input.descripcion,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: respaldoData,
      usuario_creacion: input.usuario_creacion,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
    where: { id },
  })
}

export const deleteServidorcontenedor = ({ id }) => {
  return db.servidor_contenedor.delete({
    where: { id },
  })
}

export const Servidorcontenedor = {
  contenedor_logico: (_obj, { root }) => {
    return db.servidor_contenedor
      .findUnique({ where: { id: root?.id } })
      .contenedor_logico()
  },
  servidores: (_obj, { root }) => {
    return db.servidor_contenedor
      .findUnique({ where: { id: root?.id } })
      .servidores()
  },
}
