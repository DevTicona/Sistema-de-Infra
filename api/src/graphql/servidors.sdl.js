export const schema = gql `

enum estado {
  ACTIVO
  INACTIVO
}


  type Servidor {
    id: Int!
    nro_cluster: Int!
    vmid: Int!
    nombre: String!
    nodo: String!
    ip: String!
    tipo: String!
    estado: estado!
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
    estado: estado!
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
    estado: Estado
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
