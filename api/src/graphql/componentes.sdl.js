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
  enum categoria {
    Backend
    Frontend
    Database
    NFS
  }

  enum entorno {
    Demo
    PreProd
    Prod
    Test
  }

  enum estado {
    ACTIVO
    INACTIVO
  }

  type Query {
    componentes: [Componente!]! @requireAuth
    componente(id: Int!): Componente @requireAuth
  }

  input CreateComponenteInput {
    id_sistema: Int!
    nombre: String!
    descripcion: String!
    estado: estado!
    entorno: entorno!
    categoria: categoria!
    usuario_creacion: Int!
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
    createComponente(input: CreateComponenteInput!): Componente! @requireAuth
    updateComponente(id: Int!, input: UpdateComponenteInput!): Componente!
      @requireAuth
    deleteComponente(id: Int!): Componente! @requireAuth
  }
`
