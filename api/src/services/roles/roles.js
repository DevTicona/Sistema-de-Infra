import { db } from 'src/lib/db'

export const roles = () => {
  return db.role.findMany()
}

export const role = ({ id }) => {
  return db.role.findUnique({
    where: { id },
  })
}

export const createRole = ({ input }) => {
  return db.role.create({
    data: input,
  })
}

export const updateRole = ({ id, input }) => {
  return db.role.update({
    data: input,
    where: { id },
  })
}

export const deleteRole = ({ id }) => {
  return db.role.delete({
    where: { id },
  })
}

export const Role = {
  userRoles: (_obj, { root }) => {
    return db.role.findUnique({ where: { id: root?.id } }).userRoles()
  },
}
