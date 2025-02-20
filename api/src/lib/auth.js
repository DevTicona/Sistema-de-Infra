import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from './db'

export const cookieName = 'session_%port%'

export const getCurrentUser = async (session) => {
  if (!session || typeof session.id !== 'number') {
    throw new Error('Invalid session')
  }

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

export const isAuthenticated = () => {
  return !!context.currentUser
}

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

export const requireAuth = ({ roles } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  if (roles && !hasRole(roles)) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}
