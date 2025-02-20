export const schema = gql`
  type UserRol {
    id: Int!
    userId: Int!
    roleId: Int!
    rol: Role!
    user: User!
  }

  type Query {
    userRols: [UserRol!]! @requireAuth
    userRol(id: Int!): UserRol @requireAuth
  }

  input CreateUserRolInput {
    userId: Int!
    roleId: Int!
  }

  input UpdateUserRolInput {
    userId: Int
    roleId: Int
  }

  type Mutation {
    createUserRol(input: CreateUserRolInput!): UserRol! @requireAuth
    updateUserRol(id: Int!, input: UpdateUserRolInput!): UserRol! @requireAuth
    deleteUserRol(id: Int!): UserRol! @requireAuth
  }
`
