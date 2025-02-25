import { db } from 'src/lib/db'

export const rols = () => {
  return db.roles.findMany()
}

export const rol = ({ id }) => {
  return db.roles.findUnique({
    where: { id },
  })
}

export const createRol = ({ input }) => {
  return db.roles.create({
    data: {
      nombre: input.nombre,
      tipo: input.tipo,
      estado: input.estado,
      fecha_creacion: new Date(), // Si existe
      usuario_creacion: input.usuario_creacion,
    },
  })
}

export const updateRol = ({ id, input }) => {
  return db.roles.update({
    data: {
      nombre: input.nombre,
      tipo: input.tipo,
      estado: input.estado,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
    where: { id },
  })
}

export const deleteRol = ({ id }) => {
  return db.roles.delete({
    where: { id },
  })
}

export const Rol = {
  usuario_roles: (_obj, { root }) => {
    return db.roles.findUnique({ where: { id: root?.id } }).usuario_roles()
  },
}
