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
   // Validación de estado
  const estado = input.estado === 'ACTIVO' ? 'ACTIVO' : 'INACTIVO'
  // Creamos los objetos profileData, telefonoData y correoData directamente

  return db.roles.create({
    data: {
      nombre: input.nombre,
      tipo: input.tipo,
      estado: estado,

      fecha_creacion: new Date(), // Si existe
      usuario_creacion: input.usuario_creacion,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
  })
}

export const updateRol = ({ id, input }) => {
   // Validación de estado
  const estado = input.estado === 'ACTIVO' ? 'ACTIVO' : 'INACTIVO'
  // Creamos los objetos profileData, telefonoData y correoData directamente

  return db.roles.update({
    data: {
      nombre: input.nombre,
      tipo: input.tipo,
      estado: estado,

      usuario_creacion: input.usuario_creacion,
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
