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
    id_cuchilla: Int
    servidor_contenedor: [Servidorcontenedor]!
    cuchillas: Cuchilla
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    servidors: [Servidor!]! @requireAuth
    servidor(id: Int!): Servidor @requireAuth
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
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    id_cuchilla: Int

    version_kernel: String
    sistema_operativo: String
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
    id_cuchilla: Int

    version_kernel: String
    sistema_operativo: String
  }

  type Mutation {
    createServidor(input: CreateServidorInput!): Servidor! @requireAuth
    updateServidor(id: Int!, input: UpdateServidorInput!): Servidor!
      @requireAuth
    deleteServidor(id: Int!): Servidor! @requireAuth
  }
`
