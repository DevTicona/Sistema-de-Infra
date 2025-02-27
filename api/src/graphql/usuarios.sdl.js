export const schema = gql`
  type Usuario {
    id: Int!
    uuid_ciudadano: String
    nombre_usuario: String!
    profile: JSON!
    telefono: JSON!
    correo_electronico: JSON!
    estado: estado!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    usuario_roles: [Usuariorol]!
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    usuarios: [Usuario!]! @skipAuth
    usuario(id: Int!): Usuario @skipAuth
  }

  input CreateUsuarioInput {
    uuid_ciudadano: String
    nombre_usuario: String!
    profile: JSON!
    telefono: JSON!
    correo_electronico: JSON!
    estado: estado!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int

    nombre: String
    apellido: String
    movil: String
    fijo: String
    personal: String
    trabajo: String
  }

  input UpdateUsuarioInput {
    uuid_ciudadano: String
    nombre_usuario: String
    profile: JSON
    telefono: JSON
    correo_electronico: JSON
    estado: estado
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int

    nombre: String
    apellido: String
    movil: String
    fijo: String
    personal: String
    trabajo: String
  }

  type Mutation {
    createUsuario(input: CreateUsuarioInput!): Usuario! @skipAuth
    updateUsuario(id: Int!, input: UpdateUsuarioInput!): Usuario! @skipAuth
    deleteUsuario(id: Int!): Usuario! @skipAuth
  }
`
