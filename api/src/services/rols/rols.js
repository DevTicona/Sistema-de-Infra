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
  // Creamos los objetos profileData, telefonoData y correoData directamente
  const respaldoData = {
    descripcion: input.descripcion,
    modulo_asociado: input.modulo_asociado,
    permisos: input.permisos,
    configuracion_especial: {
      restricciones_horarias: input.restricciones_horarias,
      acceso_remoto: input.acceso_remoto,
    },
  }
  return db.roles.create({
    data: {
      nombre: input.nombre,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: respaldoData,
      fecha_creacion: new Date() || null, // Si existe
      usuario_creacion: input.usuario_creacion,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
  })
}

export const updateRol = ({ id, input }) => {
  // Creamos los objetos profileData, telefonoData y correoData directamente
  const respaldoData = {
    descripcion: input.descripcion,
    modulo_asociado: input.modulo_asociado,
    permisos: input.permisos,
    configuracion_especial: {
      restricciones_horarias: input.restricciones_horarias,
      acceso_remoto: input.acceso_remoto,
    },
  }
  return db.roles.update({
    data: {
      nombre: input.nombre,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: {
        // Actualiza solo si los valores han cambiado
        descripcion: respaldoData.descripcion || undefined,
        modulo_asociado: respaldoData.modulo_asociado || undefined,
        permisos: respaldoData.permisos || undefined,
        configuracion_especial: {
          restricciones_horarias: respaldoData.restricciones_horarias,
          acceso_remoto: respaldoData.acceso_remoto,
        },
      },
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
