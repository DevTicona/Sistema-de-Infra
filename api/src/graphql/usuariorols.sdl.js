export const schema = gql`
  type Usuariorol {
    id: Int!
    id_usuario: Int
    id_rol: Int!
    id_contenedor_logico: Int!
    id_sistema: Int!
    descripcion: String!
    tipo: String!
    estado: String!
    respaldo: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    contenedor_logico: Contenedorlogico!
    roles: Rol!
    sistemas: Sistema!
    usuarios: Usuario
  }

  type Query {
    usuariorols: [Usuariorol!]! @requireAuth
    usuariorol(id: Int!): Usuariorol @requireAuth
  }

  input CreateUsuariorolInput {
    id_usuario: Int
    id_rol: Int!
    id_contenedor_logico: Int!
    id_sistema: Int!
    descripcion: String!
    tipo: String!
    estado: String!
    respaldo: JSON
    usuario_creacion: Int!
    usuario_modificacion: Int

    version: String
  }

  input UpdateUsuariorolInput {
    id_usuario: Int
    id_rol: Int
    id_contenedor_logico: Int
    id_sistema: Int
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
    createUsuariorol(input: CreateUsuariorolInput!): Usuariorol! @requireAuth
    updateUsuariorol(id: Int!, input: UpdateUsuariorolInput!): Usuariorol!
      @requireAuth
    deleteUsuariorol(id: Int!): Usuariorol! @requireAuth
  }
`
