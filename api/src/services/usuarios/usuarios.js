import { db } from 'src/lib/db'

export const usuarios = () => {
  return db.usuario.findMany()
}

export const usuario = ({ id }) => {
  return db.usuario.findUnique({
    where: { id },
  })
}

export const createUsuario = ({ input }) => {
  // Creamos los objetos profileData, telefonoData y correoData directamente
  const profileData = {
    nombre: input.nombre,
    apellido: input.apellido,
  }

  const telefonoData = {
    movil: input.movil,
    fijo: input.fijo,
  }

  const correoData = {
    personal: input.personal,
    trabajo: input.trabajo,
  }

  // Asignación segura de datos en el objeto `data`
  return db.usuario.create({
    data: {
      uuid_ciudadano: input.uuid_ciudadano || null, // Si estos campos son parte de input, úsalos
      nombre_usuario: input.nombre_usuario || '', // Asegúrate de que nombre_usuario siempre tenga un valor
      estado: input.estado || 'Activo', // Estado por defecto si no se especifica
      usuario_creacion: input.usuario_creacion || 1, // Asegúrate de que usuario_creacion esté presente
      usuario_modificacion: input.usuario_modificacion || 1, // Asigna un valor por defecto
      profile: profileData, // Guardamos el objeto como JSON
      telefono: telefonoData, // Guardamos el objeto como JSON
      correo_electronico: correoData, // Renombrado a camelCase
      fecha_creacion: new Date() || null, // Si existe
      fecha_modificacion: new Date() || null, // Si existe
    },
  })
}

export const updateUsuario = ({ id, input }) => {
  // Creamos los objetos profileData, telefonoData y correoData directamente
  const profileData = {
    nombre: input.nombre,
    apellido: input.apellido,
  }

  const telefonoData = {
    movil: input.movil,
    fijo: input.fijo,
  }

  const correoData = {
    personal: input.personal,
    trabajo: input.trabajo,
  }
  return db.usuario.update({
    data: {
      uuid_ciudadano: input.uuid_ciudadano || null, // Si estos campos son parte de input, úsalos
      nombre_usuario: input.nombre_usuario || '', // Asegúrate de que nombre_usuario siempre tenga un valor
      estado: input.estado || 'Activo', // Estado por defecto si no se especifica
      usuario_creacion: input.usuario_creacion || 1, // Asegúrate de que usuario_creacion esté presente
      usuario_modificacion: input.usuario_modificacion || 1, // Asigna un valor por defecto
      profile: {
        // Actualiza solo si los valores han cambiado
        nombre: profileData.nombre || undefined,
        apellido: profileData.apellido || undefined,
      },
      telefono: {
        movil: telefonoData.movil || undefined,
        fijo: telefonoData.fijo || undefined,
      },
      correo_electronico: {
        personal: correoData.personal || undefined,
        trabajo: correoData.trabajo || undefined,
      },
      fecha_modificacion: new Date() || null, // Si existe
    },
    where: { id },
  })
}

export const deleteUsuario = ({ id }) => {
  return db.usuario.delete({
    where: { id },
  })
}

export const Usuario = {
  usuario_roles: (_obj, { root }) => {
    return db.usuario.findUnique({ where: { id: root?.id } }).usuario_roles()
  },
}
