export const schema = gql`
  type Rol {
    id: Int!
    nombre: String!
    tipo: String!
    estado: estado!
    privilegios: JSON
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
    rols: [Rol!]! @skipAuth
    rol(id: Int!): Rol @skipAuth
  }

  input CreateRolInput {
    nombre: String!
    tipo: String!
    estado: estado!
    privilegios: JSON
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  input UpdateRolInput {
    nombre: String
    tipo: String
    estado: estado
    privilegios: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  type Mutation {
    createRol(input: CreateRolInput!): Rol! @skipAuth
    updateRol(id: Int!, input: UpdateRolInput!): Rol! @skipAuth
    deleteRol(id: Int!): Rol! @skipAuth
  }
`
