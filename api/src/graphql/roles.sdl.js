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
    createRole(input: CreateRoleInput!): Role! @skipAuth
    updateRole(id: Int!, input: UpdateRoleInput!): Role! @skipAuth
    deleteRole(id: Int!): Role! @skipAuth
  }
`
