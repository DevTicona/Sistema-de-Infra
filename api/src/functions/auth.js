import { DbAuthHandler } from '@redwoodjs/auth-dbauth-api'

import { cookieName, verifyKeycloakToken } from 'src/lib/auth'
import { db } from 'src/lib/db'
console.log(db)
export const handler = async (event, context) => {
  // Si la solicitud es un POST y se envía un token de Keycloak, procesa ese flujo
  if (event.httpMethod === 'POST') {
    let bodyData = {}
    try {
      bodyData = JSON.parse(event.body)
    } catch (error) {
      // Si no se puede parsear, dejamos bodyData vacío
    }

    if (bodyData.keycloakToken) {
      const keycloakToken = bodyData.keycloakToken
      let decoded
      try {
        decoded = await verifyKeycloakToken(keycloakToken)
      } catch (error) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid Keycloak token' }),
        }
      }

      const email = decoded.email
      if (!email) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Token does not contain email' }),
        }
      }

      // Buscar al usuario por email. Opcional: si no existe, se podría crear automáticamente.
      let user = await db.user.findUnique({ where: { email } })
      if (!user) {
        // Aquí puedes decidir si crear el usuario automáticamente o retornar un error.
        user = await db.user.create({
          data: {
            email,
            nombre: decoded.name || '',
          },
        })
      }

      // Crea la sesión almacenando el token de Keycloak en la cookie
      const sessionPayload = JSON.stringify({ token: keycloakToken })
      return {
        statusCode: 200,
        headers: {
          'Set-Cookie': `${cookieName}=${sessionPayload}; HttpOnly; Path=/; SameSite=Lax; Secure=${
            process.env.NODE_ENV !== 'development'
          }`,
        },
        body: JSON.stringify(user),
      }
    }
  }

  // --- Opciones para el flujo tradicional de dbAuth ---
  const forgotPasswordOptions = {
    handler: (user, _resetToken) => {
      return user
    },
    expires: 60 * 60 * 24,
    errors: {
      usernameNotFound: 'Username not found',
      usernameRequired: 'Username is required',
    },
  }

  const loginOptions = {
    handler: async (user) => {
      // Obtener los roles del usuario
      const userWithRoles = await db.user.findUnique({
        where: { id: user.id },
        include: { user_rol: { include: { rol: true } } },
      })

      // Devolver el usuario con sus roles
      return {
        ...user,
        roles: userWithRoles.user_rol.map((userRole) => userRole.rol.name),
      }
    },
    errors: {
      usernameOrPasswordMissing: 'Both username and password are required',
      usernameNotFound: 'Username ${username} not found',
      incorrectPassword: 'Incorrect password for ${username}',
    },
    // Tiempo de expiración de la sesión (en segundos)
    expires: 60 * 60 * 24 * 30, // 30 días en lugar de 10 años
  }

  const resetPasswordOptions = {
    handler: (_user) => {
      return true
    },
    allowReusedPassword: true,
    errors: {
      resetTokenExpired: 'resetToken is expired',
      resetTokenInvalid: 'resetToken is invalid',
      resetTokenRequired: 'resetToken is required',
      reusedPassword: 'Must choose a new password',
    },
  }

  const signupOptions = {
    handler: async ({
      username,
      hashedPassword,
      salt,
      userAttributes: _userAttributes,
    }) => {
      // Crear el usuario y asignar el rol por defecto "usuario"
      const user = await db.user.create({
        data: {
          email: username,
          hashedPassword: hashedPassword,
          salt: salt,
          nombre: _userAttributes.nombre,
          updatedAt: new Date(),
          user_rol: {
            // Cambiado a user_rol
            create: {
              rol: {
                connect: { name: 'usuario' }, // Asignar el rol por defecto
              },
            },
          },
        },
        include: { user_rol: { include: { rol: true } } }, // Cambiado a user_rol
      })

      // Devolver el usuario con sus roles
      return {
        ...user,
        roles: user.user_rol.map((userRole) => userRole.rol.name), // Cambiado a user_rol
      }
    },

    // Include any format checks for password here. Return `true` if the
    // password is valid, otherwise throw a `PasswordValidationError`.
    // Import the error along with `DbAuthHandler` from `@redwoodjs/api` above.
    passwordValidation: (_password) => {
      return true
    },

    errors: {
      // `field` will be either "username" or "password"
      fieldMissing: '${field} is required',
      usernameTaken: 'Username `${username}` already in use',
    },
  }

  const authHandler = new DbAuthHandler(event, context, {
    // Se provee el cliente Prisma
    db: db,
    // Acceso al modelo de usuario en la base de datos
    authModelAccessor: 'user',
    // Mapeo de los campos que usa dbAuth a los nombres en la base de datos
    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
      nombre: 'nombre',
    },
    allowedUserFields: ['id', 'email', 'nombre', 'roles'],
    cookie: {
      attributes: {
        HttpOnly: true,
        Path: '/',
        SameSite: 'Lax',
        Secure: process.env.NODE_ENV !== 'development',
      },
      name: cookieName,
    },
    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions,
  })

  return await authHandler.invoke()
}
