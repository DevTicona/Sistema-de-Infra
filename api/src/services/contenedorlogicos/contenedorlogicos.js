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
  return db.contenedor_logico.create({
    data: input,
  })
}

export const updateContenedorlogico = ({ id, input }) => {
  return db.contenedor_logico.update({
    data: input,
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
