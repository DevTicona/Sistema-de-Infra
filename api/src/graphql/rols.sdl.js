export const schema = gql`
  type Rol {
    id: Int!
    nombre: String!
    tipo: String!
    estado: estado!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    usuario_roles: [Usuariorol]!
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    rols: [Rol!]! @requireAuth
    rol(id: Int!): Rol @requireAuth
  }

  input CreateRolInput {
    nombre: String!
    tipo: String!
    estado: estado!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  input UpdateRolInput {
    nombre: String
    tipo: String
    estado: estado
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  type Mutation {
    createRol(input: CreateRolInput!): Rol! @requireAuth
    updateRol(id: Int!, input: UpdateRolInput!): Rol! @requireAuth
    deleteRol(id: Int!): Rol! @requireAuth
  }
`
