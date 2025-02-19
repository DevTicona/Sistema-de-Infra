import { DbAuthHandler } from '@redwoodjs/auth-dbauth-api'

import { cookieName } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const handler = async (event, context) => {
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
        include: { userRoles: { include: { role: true } } },
      })

      // Devolver el usuario con sus roles
      return {
        ...user,
        roles: userWithRoles.userRoles.map((userRole) => userRole.role.name),
      }
    },

    errors: {
      usernameOrPasswordMissing: 'Both username and password are required',
      usernameNotFound: 'Username ${username} not found',
      incorrectPassword: 'Incorrect password for ${username}',
    },

    // How long a user will remain logged in, in seconds
    expires: 60 * 60 * 24 * 365 * 10,
  }

  const resetPasswordOptions = {
    handler: (_user) => {
      return true
    },

    // If `false` then the new password MUST be different from the current one
    allowReusedPassword: true,

    errors: {
      // the resetToken is valid, but expired
      resetTokenExpired: 'resetToken is expired',
      // no user was found with the given resetToken
      resetTokenInvalid: 'resetToken is invalid',
      // the resetToken was not present in the URL
      resetTokenRequired: 'resetToken is required',
      // new password is the same as the old password (apparently they did not forget it)
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
          userRoles: {
            create: {
              role: {
                connect: { name: 'usuario' }, // Asignar el rol por defecto
              },
            },
          },
        },
        include: { userRoles: { include: { role: true } } }, // Incluir roles en la respuesta
      })

      // Devolver el usuario con sus roles
      return {
        ...user,
        roles: user.userRoles.map((userRole) => userRole.role.name),
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
    // Provide prisma db client
    db: db,

    // The name of the property you'd call on `db` to access your user table.
    // i.e. if your Prisma model is named `User` this value would be `user`, as in `db.user`
    authModelAccessor: 'user',

    // A map of what dbAuth calls a field to what your database calls it.
    // `id` is whatever column you use to uniquely identify a user (probably
    // something like `id` or `userId` or even `email`)
    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
      nombre: 'nombre',
    },

    // A list of fields on your user object that are safe to return to the
    // client when invoking a handler that returns a user (like forgotPassword
    // and signup). This list should be as small as possible to be sure not to
    // leak any sensitive information to the client.
    allowedUserFields: ['id', 'email', 'nombre', 'roles'],

    // Specifies attributes on the cookie that dbAuth sets in order to remember
    // who is logged in. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
    cookie: {
      attributes: {
        HttpOnly: true,
        Path: '/',
        SameSite: 'Lax',
        Secure: process.env.NODE_ENV !== 'development',

        // If you need to allow other domains (besides the api side) access to
        // the dbAuth session cookie:
        // Domain: 'example.com',
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
