export const schema = gql`
  type Contenedorlogico {
    id: Int!
    id_padre: Int
    codigo: String!
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
    despliegue: [Despliegue]!
    servidor_contenedor: [Servidorcontenedor]!
    usuario_roles: [Usuariorol]!
  }

  type Query {
    contenedorlogicos: [Contenedorlogico!]! @requireAuth
    contenedorlogico(id: Int!): Contenedorlogico @requireAuth
  }

  input CreateContenedorlogicoInput {
    id_padre: Int
    codigo: String!
    sigla: String!
    nombre: String!
    descripcion: String!
    tipo: String!
    estado: String!
    respaldo: JSON
    usuario_creacion: Int!
    usuario_modificacion: Int

    version: String
  }

  input UpdateContenedorlogicoInput {
    id_padre: Int
    codigo: String
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

    version: String
  }

  type Mutation {
    createContenedorlogico(
      input: CreateContenedorlogicoInput!
    ): Contenedorlogico! @requireAuth
    updateContenedorlogico(
      id: Int!
      input: UpdateContenedorlogicoInput!
    ): Contenedorlogico! @requireAuth
    deleteContenedorlogico(id: Int!): Contenedorlogico! @requireAuth
  }
`
