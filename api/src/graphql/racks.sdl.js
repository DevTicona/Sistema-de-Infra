export const schema = gql`
  type Rack {
    id: Int!
    id_data_center: Int!
    nombre: String!
    ubicacion: String
    capacidad_en_u: Int
    estado: estado!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    cuchillas: [Cuchilla]!
    data_centers: Datacenter!
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    racks: [Rack!]! @requireAuth
    rack(id: Int!): Rack @requireAuth
  }

  input CreateRackInput {
    id_data_center: Int!
    nombre: String!
    ubicacion: String
    capacidad_en_u: Int
    estado: estado!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  input UpdateRackInput {
    id_data_center: Int
    nombre: String
    ubicacion: String
    capacidad_en_u: Int
    estado: estado
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  type Mutation {
    createRack(input: CreateRackInput!): Rack! @requireAuth
    updateRack(id: Int!, input: UpdateRackInput!): Rack! @requireAuth
    deleteRack(id: Int!): Rack! @requireAuth
  }
`
