export const schema = gql`
  type Rol {
    id: Int!
    nombre: String!
    tipo: String!
    estado: String!
    respaldo: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    usuario_roles: [Usuariorol]!
  }

  type Query {
    rols: [Rol!]! @requireAuth
    rol(id: Int!): Rol @requireAuth
  }

  input CreateRolInput {
    nombre: String!
    tipo: String!
    estado: String!
    respaldo: JSON
    usuario_creacion: Int!
    usuario_modificacion: Int

    descripcion: String
    modulo_asociado: String
    permisos: [String!]!
    restricciones_horarias: [String!]!
    acceso_remoto: Boolean
  }

  input UpdateRolInput {
    nombre: String
    tipo: String
    estado: String
    respaldo: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int

    descripcion: String
    modulo_asociado: String
    permisos: [String!]!
    restricciones_horarias: [String!]!
    acceso_remoto: Boolean
  }

  type Mutation {
    createRol(input: CreateRolInput!): Rol! @requireAuth
    updateRol(id: Int!, input: UpdateRolInput!): Rol! @requireAuth
    deleteRol(id: Int!): Rol! @requireAuth
  }
`
