export const schema = gql`
  type Servidorcontenedor {
    id: Int!
    id_servidor: Int
    id_contenedor_logico: Int
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
    contenedor_logico: Contenedorlogico
    servidores: Servidor
  }

  type Query {
    servidorcontenedors: [Servidorcontenedor!]! @requireAuth
    servidorcontenedor(id: Int!): Servidorcontenedor @requireAuth
  }

  input CreateServidorcontenedorInput {
    id_servidor: Int
    id_contenedor_logico: Int
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

  input UpdateServidorcontenedorInput {
    id_servidor: Int
    id_contenedor_logico: Int
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
    createServidorcontenedor(
      input: CreateServidorcontenedorInput!
    ): Servidorcontenedor! @requireAuth
    updateServidorcontenedor(
      id: Int!
      input: UpdateServidorcontenedorInput!
    ): Servidorcontenedor! @requireAuth
    deleteServidorcontenedor(id: Int!): Servidorcontenedor! @requireAuth
  }
`
