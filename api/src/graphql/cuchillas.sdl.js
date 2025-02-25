export const schema = gql`
  type Cuchilla {
    id: Int!
    id_rack: Int!
    nombre: String!
    posicion_slot: Int
    estado: estado!
    metadata: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    racks: Rack!
    servidores: [Servidor]!
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    cuchillas: [Cuchilla!]! @requireAuth
    cuchilla(id: Int!): Cuchilla @requireAuth
  }

  input CreateCuchillaInput {
    id_rack: Int!
    nombre: String!
    posicion_slot: Int
    estado: estado!
    metadata: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  input UpdateCuchillaInput {
    id_rack: Int
    nombre: String
    posicion_slot: Int
    estado: estado
    metadata: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  type Mutation {
    createCuchilla(input: CreateCuchillaInput!): Cuchilla! @requireAuth
    updateCuchilla(id: Int!, input: UpdateCuchillaInput!): Cuchilla!
      @requireAuth
    deleteCuchilla(id: Int!): Cuchilla! @requireAuth
  }
`
