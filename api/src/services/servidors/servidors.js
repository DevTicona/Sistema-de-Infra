import { db } from 'src/lib/db'

export const servidors = () => {
  return db.servidores.findMany()
}

export const servidor = ({ id }) => {
  return db.servidores.findUnique({
    where: { id },
  })
}

export const createServidor = ({ input }) => {
  return db.servidores.create({
    data: input,
  })
}

export const updateServidor = ({ id, input }) => {
  return db.servidores.update({
    data: input,
    where: { id },
  })
}

export const deleteServidor = ({ id }) => {
  return db.servidores.delete({
    where: { id },
  })
}

export const Servidor = {
  servidor_contenedor: (_obj, { root }) => {
    return db.servidores
      .findUnique({ where: { id: root?.id } })
      .servidor_contenedor()
  },
}
