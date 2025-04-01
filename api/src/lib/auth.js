import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from './db'

export const cookieName = 'session_%port%'

// Configurar el cliente JWKS de Keycloak
const keycloakJwksUri =
  'https://auth-uit.agetic.gob.bo/auth/realms/ciudadaniadigital/protocol/openid-connect/certs'
const keycloakClient = jwksClient({ jwksUri: keycloakJwksUri })

// Obtener la llave de verificación a partir del header del token
const getKey = (header, callback) => {
  keycloakClient.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err)
    callback(null, key.getPublicKey())
  })
}

// Verificar el token emitido por Keycloak
export const verifyKeycloakToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      err ? reject(err) : resolve(decoded)
    })
  })

// Verificar si el correo electrónico está registrado en la base de datos
export const verifyUser = async (email) => {
  const usuario = await db.usuarios.findFirst({
    where: {
      OR: [
        {
          correo_electronico: {
            path: ['personal'],
            equals: email,
          },
        },
        {
          correo_electronico: {
            path: ['trabajo'],
            equals: email,
          },
        },
      ],
    },
    select: {
      id: true,
      email: true,
      nombre_usuario: true,
      usuario_roles: { select: { rol: { select: { name: true } } } },
    },
  })

  if (!usuario) {
    throw new AuthenticationError('Acceso denegado: Usuario no registrado.')
  }
  return usuario
}

/**
 * Obtener el usuario actual.
 * - Caso dbAuth: se identifica por session.id.
 * - Caso Keycloak: se valida el token y se verifica el email.
 */
export const getCurrentUser = async (session) => {
  if (!session) throw new Error('Invalid session')

  // Caso dbAuth
  if (typeof session.id === 'number') {
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        nombre: true,
        user_rol: { select: { rol: { select: { name: true } } } },
      },
    })
    if (!user) throw new AuthenticationError('User not found')
    return { ...user, roles: user.user_rol.map((ur) => ur.rol.name) }
  }

  // Caso Keycloak
  if (session.token && typeof session.token === 'string') {
    const decoded = await verifyKeycloakToken(session.token)
    const email = decoded.email
    if (!email) throw new AuthenticationError('Token does not contain email')
    const user = await verifyUser(email)
    return { ...user, roles: user.usuario_roles.map((ur) => ur.rol.name) }
  }

  throw new Error('Session format not recognized')
}

/**
 * Comprueba si el usuario está autenticado.
 * Se requiere pasar el contexto, donde debe existir currentUser.
 */
export const isAuthenticated = (context) => !!context.currentUser

/**
 * Verifica si el usuario posee alguno de los roles indicados.
 */
export const hasRole = (roles, context) => {
  if (!isAuthenticated(context)) return false
  const currentUserRoles = context.currentUser?.roles || []
  if (typeof roles === 'string') return currentUserRoles.includes(roles)
  if (Array.isArray(roles))
    return roles.some((role) => currentUserRoles.includes(role))
  return false
}

/**
 * Requiere autenticación y, opcionalmente, roles específicos.
 */
export const requireAuth = ({ roles } = {}, context) => {
  if (!isAuthenticated(context)) {
    throw new AuthenticationError("You don't have permission to do that.")
  }
  if (roles && !hasRole(roles, context)) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}
