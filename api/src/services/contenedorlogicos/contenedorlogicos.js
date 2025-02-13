import { db } from 'src/lib/db'

export const contenedorlogicos = () => {
  return db.contenedor_logico.findMany()
}

export const contenedorlogico = ({ id }) => {
  return db.contenedor_logico.findUnique({
    where: { id },
  })
}

export const createContenedorlogico = ({ input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.contenedor_logico.create({
    data: {
      id_padre: input.id_padre,
      codigo: input.codigo,
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

export const updateContenedorlogico = ({ id, input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.contenedor_logico.update({
    data: {
      id_padre: input.id_padre,
      codigo: input.codigo,
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

export const deleteContenedorlogico = ({ id }) => {
  return db.contenedor_logico.delete({
    where: { id },
  })
}

export const Contenedorlogico = {
  despliegue: (_obj, { root }) => {
    return db.contenedor_logico
      .findUnique({ where: { id: root?.id } })
      .despliegue()
  },
  servidor_contenedor: (_obj, { root }) => {
    return db.contenedor_logico
      .findUnique({ where: { id: root?.id } })
      .servidor_contenedor()
  },
  usuario_roles: (_obj, { root }) => {
    return db.contenedor_logico
      .findUnique({ where: { id: root?.id } })
      .usuario_roles()
  },
}
