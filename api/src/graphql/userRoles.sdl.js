export const schema = gql`
  type UserRole {
    id: Int!
    userId: Int!
    roleId: Int!
    user: User!
    role: Role!
  }

  type Query {
    userRoles: [UserRole!]! @requireAuth
    userRole(id: Int!): UserRole @requireAuth
  }

  input CreateUserRoleInput {
    userId: Int!
    roleId: Int!
  }

  input UpdateUserRoleInput {
    userId: Int
    roleId: Int
  }

  type Mutation {
    createUserRole(input: CreateUserRoleInput!): UserRole! @requireAuth
    updateUserRole(id: Int!, input: UpdateUserRoleInput!): UserRole!
      @requireAuth
    deleteUserRole(id: Int!): UserRole! @requireAuth
  }
`
