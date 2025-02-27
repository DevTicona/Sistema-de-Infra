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
    data: {
      nombre: input.nombre,
      ubicacion: input.ubicacion,
      capacidad: input.capacidad,
      estado: input.estado,
      fecha_creacion: new Date(),
      usuario_creacion: input.usuario_creacion,
    },
  })
}

export const updateDatacenter = ({ id, input }) => {
  return db.data_centers.update({
    data: {
      nombre: input.nombre,
      ubicacion: input.ubicacion,
      capacidad: input.capacidad,
      estado: input.estado,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
    where: { id },
  })
}

export const deleteDatacenter = ({ id }) => {
  return db.data_centers.delete({
    where: { id },
  })
}

export const Datacenter = {
  servidores: (_obj, { root }) => {
    return db.data_centers.findUnique({ where: { id: root?.id } }).servidores()
  },
}
