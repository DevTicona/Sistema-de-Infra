import { db } from 'src/lib/db'

export const datacenters = () => {
  return db.data_centers.findMany()
}

export const datacenter = ({ id }) => {
  return db.data_centers.findUnique({
    where: { id },
  })
}

export const createDatacenter = ({ input }) => {
  return db.data_centers.create({
    data: input,
  })
}

export const updateDatacenter = ({ id, input }) => {
  return db.data_centers.update({
    data: input,
    where: { id },
  })
}

export const deleteDatacenter = ({ id }) => {
  return db.data_centers.delete({
    where: { id },
  })
}

export const Datacenter = {
  racks: (_obj, { root }) => {
    return db.data_centers.findUnique({ where: { id: root?.id } }).racks()
  },
}
