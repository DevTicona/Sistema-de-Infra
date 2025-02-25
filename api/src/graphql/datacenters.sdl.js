export const schema = gql`
  type Datacenter {
    id: Int!
    nombre: String!
    ubicacion: String
    capacidad: Int
    estado: estado!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    racks: [Rack]!
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    datacenters: [Datacenter!]! @requireAuth
    datacenter(id: Int!): Datacenter @requireAuth
  }

  input CreateDatacenterInput {
    nombre: String!
    ubicacion: String
    capacidad: Int
    estado: estado!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  input UpdateDatacenterInput {
    nombre: String
    ubicacion: String
    capacidad: Int
    estado: estado
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  type Mutation {
    createDatacenter(input: CreateDatacenterInput!): Datacenter! @requireAuth
    updateDatacenter(id: Int!, input: UpdateDatacenterInput!): Datacenter!
      @requireAuth
    deleteDatacenter(id: Int!): Datacenter! @requireAuth
  }
`
