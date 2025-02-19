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
      userRoles: {
        select: {
          role: {
            select: { name: true }, // Recuperar solo los nombres de los roles
          },
        },
      },
    },
  })

  return {
    ...user,
    roles: user.userRoles.map((userRole) => userRole.role.name),
  }
}

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = () => {
  return !!context.currentUser
}

/**
 * Checks if the currentUser is authenticated (and assigned one of the given roles)
 *
 * @param roles: {@link AllowedRoles} - Checks if the currentUser is assigned one of these roles
 *
 * @returns {boolean} - Returns true if the currentUser is logged in and assigned one of the given roles,
 * or when no roles are provided to check against. Otherwise returns false.
 */
export const hasRole = (roles) => {
  if (!isAuthenticated()) {
    return false
  }

  const currentUserRoles = context.currentUser?.userRoles.map(
    (userRole) => userRole.role.name
  )

  if (typeof roles === 'string') {
    return currentUserRoles.includes(roles)
  }

  if (Array.isArray(roles)) {
    return roles.some((role) => currentUserRoles.includes(role))
  }

  // roles not found
  return false
}

/**
 * Use requireAuth in your services to check that a user is logged in,
 * whether or not they are assigned a role, and optionally raise an
 * error if they're not.
 *
 * @param roles: {@link AllowedRoles} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser is authenticated (and assigned one of the given roles)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = ({ roles } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  if (roles && !hasRole(roles)) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}
