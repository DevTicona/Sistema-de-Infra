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
    data: {
      id_usuario: input.id_usuario,
      id_rol: input.id_rol,
      id_despliegue: input.id_despliegue,
      id_sistema: input.id_sistema,

      estado: input.estado,
      fecha_creacion: new Date(), // Si existe
      usuario_creacion: input.usuario_creacion,
    },
  })
}

export const updateUsuariorol = ({ id, input }) => {
  return db.usuario_roles.update({
    data: {
      id_usuario: input.id_usuario,
      id_rol: input.id_rol,
      id_despliegue: input.id_despliegue,
      id_sistema: input.id_sistema,

      estado: input.estado,
      fecha_creacion: new Date(), // Si existe
      usuario_creacion: input.usuario_creacion,
    },
    where: { id },
  })
}

export const deleteUsuariorol = ({ id }) => {
  return db.usuario_roles.delete({
    where: { id },
  })
}

export const Usuariorol = {
  despliegue: (_obj, { root }) => {
    return db.usuario_roles.findUnique({ where: { id: root?.id } }).despliegue()
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
