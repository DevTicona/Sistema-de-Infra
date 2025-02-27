export const schema = gql`
  type Role {
    id: Int!
    name: String!
    user_rol: [UserRol]!
  }

  type Query {
    roles: [Role!]! @skipAuth
    role(id: Int!): Role @skipAuth
  }

  input CreateRoleInput {
    name: String!
  }

  input UpdateRoleInput {
    name: String
  }

  type Mutation {
    createRole(input: CreateRoleInput!): Role! @requireAuth
    updateRole(id: Int!, input: UpdateRoleInput!): Role! @requireAuth
    deleteRole(id: Int!): Role! @requireAuth
  }
`
