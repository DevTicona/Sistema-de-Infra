import { db } from 'src/lib/db'

export const usuarios = () => {
  return db.usuarios.findMany()
}

export const usuario = ({ id }) => {
  return db.usuarios.findUnique({
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

  return db.usuarios.create({
    data: {
      uuid_ciudadano: input.uuid_ciudadano, // Si estos campos son parte de input, úsalos
      nombre_usuario: input.nombre_usuario, // Asegúrate de que nombre_usuario siempre tenga un valor
      estado: input.estado || 'Activo', // Estado por defecto si no se especifica
      usuario_creacion: input.usuario_creacion, // Asegúrate de que usuario_creacion esté presente
      profile: profileData, // Guardamos el objeto como JSON
      telefono: telefonoData, // Guardamos el objeto como JSON
      correo_electronico: correoData, // Renombrado a camelCase
      fecha_creacion: new Date(),
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

  return db.usuarios.update({
    data: {
      uuid_ciudadano: input.uuid_ciudadano, // Si estos campos son parte de input, úsalos
      nombre_usuario: input.nombre_usuario, // Asegúrate de que nombre_usuario siempre tenga un valor
      estado: input.estado || 'Activo', // Estado por defecto si no se especifica
      // Asegúrate de que usuario_creacion esté presente
      profile: profileData, // Guardamos el objeto como JSON
      telefono: telefonoData, // Guardamos el objeto como JSON
      correo_electronico: correoData, // Renombrado a camelCase
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
    where: { id },
  })
}

export const deleteUsuario = ({ id }) => {
  return db.usuarios.delete({
    where: { id },
  })
}

export const Usuario = {
  usuario_roles: (_obj, { root }) => {
    return db.usuarios.findUnique({ where: { id: root?.id } }).usuario_roles()
  },
}
