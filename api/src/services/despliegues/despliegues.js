import { db } from 'src/lib/db'

export const despliegues = () => {
  return db.despliegue.findMany()
}

export const despliegue = ({ id }) => {
  return db.despliegue.findUnique({
    where: { id },
  })
}

export const createDespliegue = ({ input }) => {
  return db.despliegue.create({
    data: input,

  })
}

export const updateDespliegue = ({ id, input }) => {
  return db.despliegue.update({
    data: input,

    where: { id },
  })
}

export const deleteDespliegue = ({ id }) => {
  return db.despliegue.delete({
    where: { id },
  })
}

export const Despliegue = {
  componentes: (_obj, { root }) => {
    return db.despliegue.findUnique({ where: { id: root?.id } }).componentes()
  },
  servidores: (_obj, { root }) => {
    return db.despliegue.findUnique({ where: { id: root?.id } }).servidores()
  },
  usuario_roles: (_obj, { root }) => {
    return db.despliegue.findUnique({ where: { id: root?.id } }).usuario_roles()
  },
}
