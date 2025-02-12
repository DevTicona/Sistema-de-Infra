import { db } from 'src/lib/db'

export const usuariorols = () => {
  return db.usuario_roles.findMany()
}

export const usuariorol = ({ id }) => {
  return db.usuario_roles.findUnique({
    where: { id },
  })
}

export const createUsuariorol = ({ input }) => {
  return db.usuario_roles.create({
    data: input,
  })
}

export const updateUsuariorol = ({ id, input }) => {
  return db.usuario_roles.update({
    data: input,
    where: { id },
  })
}

export const deleteUsuariorol = ({ id }) => {
  return db.usuario_roles.delete({
    where: { id },
  })
}

export const Usuariorol = {
  contenedor_logico: (_obj, { root }) => {
    return db.usuario_roles
      .findUnique({ where: { id: root?.id } })
      .contenedor_logico()
  },
  roles: (_obj, { root }) => {
    return db.usuario_roles.findUnique({ where: { id: root?.id } }).roles()
  },
  sistemas: (_obj, { root }) => {
    return db.usuario_roles.findUnique({ where: { id: root?.id } }).sistemas()
  },
  usuarios: (_obj, { root }) => {
    return db.usuario_roles.findUnique({ where: { id: root?.id } }).usuarios()
  },
}
