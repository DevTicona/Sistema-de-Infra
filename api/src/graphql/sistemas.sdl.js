export const schema = gql`
  type Sistema {
    id: Int!
    id_padre: Int
    id_entidad: Int!
    codigo: String!
    sigla: String!
    nombre: String!
    descripcion: String!
    tipo: String!
    estado: String!
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
    tipo: String!
    estado: String!
    respaldo: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  input UpdateSistemaInput {
    id_padre: Int
    id_entidad: Int
    codigo: String
    sigla: String
    nombre: String
    descripcion: String
    tipo: String
    estado: String
    respaldo: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  type Mutation {
    createSistema(input: CreateSistemaInput!): Sistema! @requireAuth
    updateSistema(id: Int!, input: UpdateSistemaInput!): Sistema! @requireAuth
    deleteSistema(id: Int!): Sistema! @requireAuth
  }
`
