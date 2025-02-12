import { db } from 'src/lib/db'

export const entidads = () => {
  return db.entidades.findMany()
}

export const entidad = ({ id }) => {
  return db.entidades.findUnique({
    where: { id },
  })
}

export const createEntidad = ({ input }) => {
  return db.entidades.create({
    data: input,
  })
}

export const updateEntidad = ({ id, input }) => {
  return db.entidades.update({
    data: input,
    where: { id },
  })
}

export const deleteEntidad = ({ id }) => {
  return db.entidades.delete({
    where: { id },
  })
}

export const Entidad = {
  sistemas: (_obj, { root }) => {
    return db.entidades.findUnique({ where: { id: root?.id } }).sistemas()
  },
}
