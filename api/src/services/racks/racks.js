import { db } from 'src/lib/db'

export const racks = () => {
  return db.racks.findMany()
}

export const rack = ({ id }) => {
  return db.racks.findUnique({
    where: { id },
  })
}

export const createRack = ({ input }) => {
  return db.racks.create({
    data: input,
  })
}

export const updateRack = ({ id, input }) => {
  return db.racks.update({
    data: input,
    where: { id },
  })
}

export const deleteRack = ({ id }) => {
  return db.racks.delete({
    where: { id },
  })
}

export const Rack = {
  cuchillas: (_obj, { root }) => {
    return db.racks.findUnique({ where: { id: root?.id } }).cuchillas()
  },
  data_centers: (_obj, { root }) => {
    return db.racks.findUnique({ where: { id: root?.id } }).data_centers()
  },
}
