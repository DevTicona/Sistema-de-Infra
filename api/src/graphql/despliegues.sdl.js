export const schema = gql`
  type Despliegue {
    id: Int!
    id_componente: Int
    id_servidor: Int!
    agrupador: String!
    nombre: String!
    tipo: String!
    estado: estado!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    componentes: Componente
    servidores: Servidor!
    usuario_roles: [Usuariorol]!
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    despliegues: [Despliegue!]! @skipAuth
    despliegue(id: Int!): Despliegue @skipAuth
  }

  input CreateDespliegueInput {
    id_componente: Int
    id_servidor: Int!
    agrupador: String!
    nombre: String!
    tipo: String!
    estado: estado!

    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  input UpdateDespliegueInput {
    id_componente: Int
    id_servidor: Int
    agrupador: String
    nombre: String
    tipo: String
    estado: estado
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  type Mutation {
    createDespliegue(input: CreateDespliegueInput!): Despliegue! @skipAuth
    updateDespliegue(id: Int!, input: UpdateDespliegueInput!): Despliegue!
      @skipAuth
    deleteDespliegue(id: Int!): Despliegue! @skipAuth
  }
`
