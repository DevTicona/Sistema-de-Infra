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
    servidores: [Servidor]!
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    datacenters: [Datacenter!]! @skipAuth
    datacenter(id: Int!): Datacenter @skipAuth
  }

  input CreateDatacenterInput {
    nombre: String!
    ubicacion: String
    capacidad: Int
    estado: estado!
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
    createDatacenter(input: CreateDatacenterInput!): Datacenter! @skipAuth
    updateDatacenter(id: Int!, input: UpdateDatacenterInput!): Datacenter!
      @skipAuth
    deleteDatacenter(id: Int!): Datacenter! @skipAuth
  }
`
