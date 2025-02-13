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
  const respaldoData = {
    version: input.version,
  }
  return db.usuario_roles.create({
    data: {
      id_usuario: input.id_usuario,
      id_rol: input.id_rol,
      id_contenedor_logico: input.id_contenedor_logico,
      id_sistema: input.id_sistema,
      descripcion: input.descripcion,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: respaldoData,
      fecha_creacion: new Date(),
      usuario_creacion: input.usuario_creacion,
      usuario_modificacion: input.usuario_modificacion,
    },
  })
}

export const updateUsuariorol = ({ id, input }) => {
  const respaldoData = {
    version: input.version,
  }
  return db.usuario_roles.update({
    data: {
      id_usuario: input.id_usuario,
      id_rol: input.id_rol,
      id_contenedor_logico: input.id_contenedor_logico,
      id_sistema: input.id_sistema,
      descripcion: input.descripcion,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: respaldoData,
      usuario_creacion: input.usuario_creacion,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
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
