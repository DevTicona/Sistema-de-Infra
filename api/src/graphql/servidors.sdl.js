export const schema = gql`
  type Servidor {
    id: Int!
    nro_cluster: Int!
    vmid: Int!
    nombre: String!
    nodo: String!
    ip: String!
    tipo: String!
    estado: estado!
    metadata: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    id_data_center: Int
    despliegue: [Despliegue]!
    data_centers: Datacenter
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    servidors: [Servidor!]! @skipAuth
    servidor(id: Int!): Servidor @skipAuth
  }

  input CreateServidorInput {
    nro_cluster: Int!
    vmid: Int!
    nombre: String!
    nodo: String!
    ip: String!
    tipo: String!
    estado: estado!
    metadata: JSON
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    id_data_center: Int

    blade: String
    chasis: String
  }

  input UpdateServidorInput {
    nro_cluster: Int
    vmid: Int
    nombre: String
    nodo: String
    ip: String
    tipo: String
    estado: estado
    metadata: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    id_data_center: Int
    blade: String
    chasis: String
  }

  type Mutation {
    createServidor(input: CreateServidorInput!): Servidor! @skipAuth
    updateServidor(id: Int!, input: UpdateServidorInput!): Servidor! @skipAuth
    deleteServidor(id: Int!): Servidor! @skipAuth
  }
`
