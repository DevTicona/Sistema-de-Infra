export const schema = gql`
  type Despliegue {
    id: Int!
    id_componente: Int
    id_contenedor_logico: Int!
    sigla: String!
    nombre: String!
    descripcion: String!
    tipo: String!
    estado: estado!
    respaldo: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    componentes: Componente
    contenedor_logico: Contenedorlogico!
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    despliegues: [Despliegue!]! @requireAuth
    despliegue(id: Int!): Despliegue @requireAuth
  }

  input CreateDespliegueInput {
    id_componente: Int
    id_contenedor_logico: Int!
    sigla: String!
    nombre: String!
    descripcion: String!
    tipo: String!
    estado: estado!
    respaldo: JSON
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int

    version: String
  }

  input UpdateDespliegueInput {
    id_componente: Int
    id_contenedor_logico: Int
    sigla: String
    nombre: String
    descripcion: String
    tipo: String
    estado: estado
    respaldo: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int

    version: String
  }

  type Mutation {
    createDespliegue(input: CreateDespliegueInput!): Despliegue! @requireAuth
    updateDespliegue(id: Int!, input: UpdateDespliegueInput!): Despliegue!
      @requireAuth
    deleteDespliegue(id: Int!): Despliegue! @requireAuth
  }
`
