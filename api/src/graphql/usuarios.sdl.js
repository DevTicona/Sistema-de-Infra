export const schema = gql`
  type Usuario {
    id: Int!
    uuid_ciudadano: String
    nombre_usuario: String!
    profile: JSON!
    telefono: JSON!
    correo_electronico: JSON!
    estado: String!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    usuario_roles: [Usuariorol]!
  }

  type Query {
    usuarios: [Usuario!]! @requireAuth
    usuario(id: Int!): Usuario @requireAuth
  }

  input CreateUsuarioInput {
    uuid_ciudadano: String
    nombre_usuario: String!
    profile: JSON!
    telefono: JSON!
    correo_electronico: JSON!
    estado: String!
    usuario_creacion: Int!
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
    estado: String
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
    createUsuario(input: CreateUsuarioInput!): Usuario! @requireAuth
    updateUsuario(id: Int!, input: UpdateUsuarioInput!): Usuario! @requireAuth
    deleteUsuario(id: Int!): Usuario! @requireAuth
  }
`
