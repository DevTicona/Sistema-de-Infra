import { db } from 'src/lib/db'

export const cuchillas = () => {
  return db.cuchillas.findMany()
}

export const cuchilla = ({ id }) => {
  return db.cuchillas.findUnique({
    where: { id },
  })
}

export const createCuchilla = ({ input }) => {
  return db.cuchillas.create({
    data: input,
  })
}

export const updateCuchilla = ({ id, input }) => {
  return db.cuchillas.update({
    data: input,
    where: { id },
  })
}

export const deleteCuchilla = ({ id }) => {
  return db.cuchillas.delete({
    where: { id },
  })
}

export const Cuchilla = {
  racks: (_obj, { root }) => {
    return db.cuchillas.findUnique({ where: { id: root?.id } }).racks()
  },
  servidores: (_obj, { root }) => {
    return db.cuchillas.findUnique({ where: { id: root?.id } }).servidores()
  },
}
