export const schema = gql`


enum estado {
  ACTIVO
  INACTIVO
}

  type Sistema {
    id: Int!
    id_padre: Int
    id_entidad: Int!
    codigo: String!
    sigla: String!
    nombre: String!
    descripcion: String!
    estado: estado!
    respaldo: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    componentes: [Componente]!
    entidades: Entidad!
    sistemas: Sistema
    other_sistemas: [Sistema]!
    usuario_roles: [Usuariorol]!
  }

  type Query {
    sistemas: [Sistema!]! @requireAuth
    sistema(id: Int!): Sistema @requireAuth
  }

  input CreateSistemaInput {
    id_padre: Int
    id_entidad: Int!
    codigo: String!
    sigla: String!
    nombre: String!
    descripcion: String!
    estado: estado!
    respaldo: JSON
    usuario_creacion: Int!
    usuario_modificacion: Int

    version: String
  }

  input UpdateSistemaInput {
    id_padre: Int
    id_entidad: Int
    codigo: String
    sigla: String
    nombre: String
    descripcion: String
    estado: estado
    respaldo: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int

    version: String
  }

  type Mutation {
    createSistema(input: CreateSistemaInput!): Sistema! @requireAuth
    updateSistema(id: Int!, input: UpdateSistemaInput!): Sistema! @requireAuth
    deleteSistema(id: Int!): Sistema! @requireAuth
  }
`
