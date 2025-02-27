export const schema = gql`
  type Sistema {
    id: Int!
    id_padre: Int
    id_entidad: Int!
    codigo: String!
    sigla: String!
    nombre: String!
    descripcion: String!
    estado: estado!
    respaldo_creacion: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    componentes: [Componente]!
    entidades: Entidad!
    sistemas: Sistema
    other_sistemas: [Sistema]!
    usuario_roles: [Usuariorol]!
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    sistemas: [Sistema!]! @skipAuth
    sistema(id: Int!): Sistema @skipAuth
  }

  input CreateSistemaInput {
    id_padre: Int
    id_entidad: Int!
    codigo: String!
    sigla: String!
    nombre: String!
    descripcion: String!
    estado: estado!
    respaldo_creacion: JSON
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int

    tipo_respaldo: String # Nuevo campo
    detalle_respaldo: String # Nuevo campo
    fecha_solicitud: String # Nuevo campo
    responsable_admin: String! # Nuevo campo
  }

  input UpdateSistemaInput {
    id_padre: Int
    id_entidad: Int
    codigo: String
    sigla: String
    nombre: String
    descripcion: String
    estado: estado
    respaldo_creacion: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int

    tipo_respaldo: String # Nuevo campo
    detalle_respaldo: String # Nuevo campo
    fecha_solicitud: String! # Nuevo campo
    responsable_admin: String! # Nuevo campo
  }

  type Mutation {
    createSistema(input: CreateSistemaInput!): Sistema! @skipAuth
    updateSistema(id: Int!, input: UpdateSistemaInput!): Sistema! @skipAuth
    deleteSistema(id: Int!): Sistema! @skipAuth
  }
`
