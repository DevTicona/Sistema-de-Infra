export const schema = gql `
  type Servidor {
    id: Int!
    nro_cluster: Int!
    vmid: Int!
    nombre: String!
    nodo: String!
    ip: String!
    tipo: String!
    estado: String!
    respaldo: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    servidor_contenedor: [Servidorcontenedor]!
    sistema_operativo: String
    version_kernel: String
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
    estado: String!
    respaldo: JSON
    usuario_creacion: Int!
    usuario_modificacion: Int
    sistema_operativo: String
    version_kernel: String
  }

  input UpdateServidorInput {
    nro_cluster: Int
    vmid: Int
    nombre: String
    nodo: String
    ip: String
    tipo: String
    estado: String
    respaldo: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    sistema_operativo: String
    version_kernel: String
  }

  type Mutation {
    createServidor(input: CreateServidorInput!): Servidor! @requireAuth
    updateServidor(id: Int!, input: UpdateServidorInput!): Servidor!
      @requireAuth
    deleteServidor(id: Int!): Servidor! @requireAuth
  }
`
