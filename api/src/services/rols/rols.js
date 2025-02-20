import { db } from 'src/lib/db'

export const rols = () => {
  return db.rol.findMany()
}

export const rol = ({ id }) => {
  return db.rol.findUnique({
    where: { id },
  })
}

export const createRol = ({ input }) => {
  return db.rol.create({
    data: input,
  })
}

export const updateRol = ({ id, input }) => {
  return db.rol.update({
    data: input,
    where: { id },
  })
}

export const deleteRol = ({ id }) => {
  return db.rol.delete({
    where: { id },
  })
}

export const Rol = {
  usuario_roles: (_obj, { root }) => {
    return db.rol.findUnique({ where: { id: root?.id } }).usuario_roles()
  },
}
