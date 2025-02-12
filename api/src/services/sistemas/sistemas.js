import { db } from 'src/lib/db'

export const sistemas = () => {
  return db.sistemas.findMany()
}

export const sistema = ({ id }) => {
  return db.sistemas.findUnique({
    where: { id },
  })
}

export const createSistema = ({ input }) => {
  return db.sistemas.create({
    data: input,
  })
}

export const updateSistema = ({ id, input }) => {
  return db.sistemas.update({
    data: input,
    where: { id },
  })
}

export const deleteSistema = ({ id }) => {
  return db.sistemas.delete({
    where: { id },
  })
}

export const Sistema = {
  componentes: (_obj, { root }) => {
    return db.sistemas.findUnique({ where: { id: root?.id } }).componentes()
  },
  entidades: (_obj, { root }) => {
    return db.sistemas.findUnique({ where: { id: root?.id } }).entidades()
  },
  sistemas: (_obj, { root }) => {
    return db.sistemas.findUnique({ where: { id: root?.id } }).sistemas()
  },
  other_sistemas: (_obj, { root }) => {
    return db.sistemas.findUnique({ where: { id: root?.id } }).other_sistemas()
  },
  usuario_roles: (_obj, { root }) => {
    return db.sistemas.findUnique({ where: { id: root?.id } }).usuario_roles()
  },
}
