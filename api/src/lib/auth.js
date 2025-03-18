import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from './db'

export const cookieName = 'session_%port%'

// Configuración del cliente JWKS de Keycloak
const keycloakJwksUri =
  'https://tu-servidor-keycloak/auth/realms/tu-realm/protocol/openid-connect/certs'
const keycloakClient = jwksClient({
  jwksUri: keycloakJwksUri,
})

// Función auxiliar para obtener la llave de verificación a partir del header del token
function getKey(header, callback) {
  keycloakClient.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err)
    } else {
      const signingKey = key.getPublicKey()
      callback(null, signingKey)
    }
  })
}

// Función para verificar el token emitido por Keycloak
const verifyKeycloakToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return reject(err)
      }
      resolve(decoded)
    })
  })
}

/**
 * getCurrentUser: Se encarga de obtener el usuario actual
 * - Si la sesión corresponde a dbAuth (session.id es numérico) se busca el usuario en la base de datos.
 * - Si la sesión proviene de Keycloak (session.token es un string), se valida el token y se busca el usuario por email.
 */
export const getCurrentUser = async (session) => {
  if (!session) {
    throw new Error('Invalid session')
  }

  // Caso dbAuth
  if (typeof session.id === 'number') {
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        nombre: true,
        user_rol: {
          select: {
            rol: {
              select: { name: true },
            },
          },
        },
      },
    })

    if (!user) {
      throw new AuthenticationError('User not found')
    }

    return {
      ...user,
      roles: user.user_rol.map((userRole) => userRole.rol.name),
    }
  }

  // Caso Keycloak: se espera que la sesión tenga una propiedad "token"
  if (session.token && typeof session.token === 'string') {
    let decoded
    try {
      decoded = await verifyKeycloakToken(session.token)
    } catch (error) {
      throw new AuthenticationError('Invalid Keycloak token')
    }

    // Se asume que el token contiene la dirección de email
    const email = decoded.email
    if (!email) {
      throw new AuthenticationError('Token does not contain email')
    }

    // Busca el usuario en la base de datos por email. Opcionalmente, podrías crear el usuario si no existe.
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        nombre: true,
        user_rol: {
          select: {
            rol: {
              select: { name: true },
            },
          },
        },
      },
    })

    if (!user) {
      throw new AuthenticationError('User not found')
    }

    return {
      ...user,
      roles: user.user_rol.map((userRole) => userRole.rol.name),
    }
  }

  throw new Error('Session format not recognized')
}

/**
 * isAuthenticated: Se asume que context.currentUser ya fue establecido en el contexto de GraphQL.
 */
export const isAuthenticated = () => {
  return !!context.currentUser
}

/**
 * hasRole: Comprueba si el usuario autenticado tiene alguno de los roles requeridos.
 */
export const hasRole = (roles) => {
  if (!isAuthenticated()) {
    return false
  }

  const currentUserRoles = context.currentUser?.roles || []

  if (typeof roles === 'string') {
    return currentUserRoles.includes(roles)
  }

  if (Array.isArray(roles)) {
    return roles.some((role) => currentUserRoles.includes(role))
  }

  return false
}

/**
 * requireAuth: Función para proteger resolvers que requieran autenticación y/o ciertos roles.
 */
export const requireAuth = ({ roles } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  if (roles && !hasRole(roles)) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}
