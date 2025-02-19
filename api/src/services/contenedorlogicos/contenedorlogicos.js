import { db } from 'src/lib/db'

export const contenedorlogicos = () => {
  return db.contenedorlogico.findMany()
}

export const contenedorlogico = ({ id }) => {
  return db.contenedorlogico.findUnique({
    where: { id },
  })
}

export const createContenedorlogico = ({ input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.contenedorlogico.create({
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
    },
  })
}

export const updateContenedorlogico = ({ id, input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.contenedorlogico.update({
    data: {
      id_padre: input.id_padre,
      codigo: input.codigo,
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

export const deleteContenedorlogico = ({ id }) => {
  return db.contenedorlogico.delete({
    where: { id },
  })
}

export const Contenedorlogico = {
  despliegue: (_obj, { root }) => {
    return db.contenedorlogico
      .findUnique({ where: { id: root?.id } })
      .despliegue()
  },
  servidor_contenedor: (_obj, { root }) => {
    return db.contenedorlogico
      .findUnique({ where: { id: root?.id } })
      .servidor_contenedor()
  },
  usuario_roles: (_obj, { root }) => {
    return db.contenedorlogico
      .findUnique({ where: { id: root?.id } })
      .usuario_roles()
  },
}
