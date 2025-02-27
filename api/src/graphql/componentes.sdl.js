export const schema = gql`
  type Componente {
    id: Int!
    id_sistema: Int!
    nombre: String!
    descripcion: String!
    estado: estado!
    entorno: entorno!
    categoria: categoria!
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    sistemas: Sistema!
    despliegue: [Despliegue]!
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  enum entorno {
    Demo
    PreProd
    Prod
    Test
  }

  enum categoria {
    Backend
    Frontend
    Database
    NFS
  }

  type Query {
    componentes: [Componente!]! @skipAuth
    componente(id: Int!): Componente @skipAuth
  }

  input CreateComponenteInput {
    id_sistema: Int!
    nombre: String!
    descripcion: String!
    estado: estado!
    entorno: entorno!
    categoria: categoria!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  input UpdateComponenteInput {
    id_sistema: Int
    nombre: String
    descripcion: String
    estado: estado
    entorno: entorno
    categoria: categoria
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
  }

  type Mutation {
    createComponente(input: CreateComponenteInput!): Componente! @skipAuth
    updateComponente(id: Int!, input: UpdateComponenteInput!): Componente!
      @skipAuth
    deleteComponente(id: Int!): Componente! @skipAuth
  }
`
