export const schema = gql`
  type Usuariorol {
    id: Int!
    id_usuario: Int
    id_rol: Int!
    id_despliegue: Int!
    id_sistema: Int!
    descripcion: String!
    tipo: String!
    estado: estado!
    respaldo: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    despliegue: Despliegue!
    roles: Rol!
    sistemas: Sistema!
    usuarios: Usuario
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    usuariorols: [Usuariorol!]! @skipAuth
    usuariorol(id: Int!): Usuariorol @skipAuth
  }

  input CreateUsuariorolInput {
    id_usuario: Int
    id_rol: Int!
    id_despliegue: Int!
    id_sistema: Int!
    descripcion: String!
    tipo: String!
    estado: estado!
    respaldo: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  input UpdateUsuariorolInput {
    id_usuario: Int
    id_rol: Int
    id_despliegue: Int
    id_sistema: Int
    descripcion: String
    tipo: String
    estado: estado
    respaldo: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  type Mutation {
    createUsuariorol(input: CreateUsuariorolInput!): Usuariorol! @skipAuth
    updateUsuariorol(id: Int!, input: UpdateUsuariorolInput!): Usuariorol!
      @skipAuth
    deleteUsuariorol(id: Int!): Usuariorol! @skipAuth
  }
`
