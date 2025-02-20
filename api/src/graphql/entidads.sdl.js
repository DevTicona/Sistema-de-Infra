export const schema = gql`
  enum estado {
  ACTIVO
  INACTIVO
}


  type Entidad {
    id: Int!
    codigo: String!
    sigla: String!
    nombre: String!
    estado: estado!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    sistemas: [Sistema]!
  }

  type Query {
    entidads: [Entidad!]! @requireAuth
    entidad(id: Int!): Entidad @requireAuth
  }

  input CreateEntidadInput {
    codigo: String!
    sigla: String!
    nombre: String!
    estado: estado!
    usuario_creacion: Int!
    usuario_modificacion: Int
  }

  input UpdateEntidadInput {
    codigo: String
    sigla: String
    nombre: String
    estado: estado
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  type Mutation {
    createEntidad(input: CreateEntidadInput!): Entidad! @requireAuth
    updateEntidad(id: Int!, input: UpdateEntidadInput!): Entidad! @requireAuth
    deleteEntidad(id: Int!): Entidad! @requireAuth
  }

  type Query {
  entidadesBySigla(sigla: String!): [Entidad!]! @requireAuth
}

`
