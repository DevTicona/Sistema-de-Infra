import { db } from 'src/lib/db'

export const userRols = () => {
  return db.user_rol.findMany()
}

export const userRol = ({ id }) => {
  return db.user_rol.findUnique({
    where: { id },
  })
}

export const createUserRol = ({ input }) => {
  return db.user_rol.create({
    data: input,
  })
}

export const updateUserRol = ({ id, input }) => {
  return db.user_rol.update({
    data: input,
    where: { id },
  })
}

export const deleteUserRol = ({ id }) => {
  return db.user_rol.delete({
    where: { id },
  })
}

export const UserRol = {
  rol: (_obj, { root }) => {
    return db.user_rol.findUnique({ where: { id: root?.id } }).rol()
  },
  user: (_obj, { root }) => {
    return db.user_rol.findUnique({ where: { id: root?.id } }).user()
  },
}
