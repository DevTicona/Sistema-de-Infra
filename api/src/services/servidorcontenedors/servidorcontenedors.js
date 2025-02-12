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
  return db.servidor_contenedor.create({
    data: input,
  })
}

export const updateServidorcontenedor = ({ id, input }) => {
  return db.servidor_contenedor.update({
    data: input,
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
