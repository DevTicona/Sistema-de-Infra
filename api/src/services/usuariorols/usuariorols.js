import { db } from 'src/lib/db'

export const usuariorols = () => {
  return db.usuariorol.findMany()
}

export const usuariorol = ({ id }) => {
  return db.usuariorol.findUnique({
    where: { id },
  })
}

export const createUsuariorol = ({ input }) => {
  return db.usuariorol.create({
    data: input,
  })
}

export const updateUsuariorol = ({ id, input }) => {
  return db.usuariorol.update({
    data: input,
    where: { id },
  })
}

export const deleteUsuariorol = ({ id }) => {
  return db.usuariorol.delete({
    where: { id },
  })
}

export const Usuariorol = {
  despliegue: (_obj, { root }) => {
    return db.usuariorol.findUnique({ where: { id: root?.id } }).despliegue()
  },
  roles: (_obj, { root }) => {
    return db.usuariorol.findUnique({ where: { id: root?.id } }).roles()
  },
  sistemas: (_obj, { root }) => {
    return db.usuariorol.findUnique({ where: { id: root?.id } }).sistemas()
  },
  usuarios: (_obj, { root }) => {
    return db.usuariorol.findUnique({ where: { id: root?.id } }).usuarios()
  },
}
