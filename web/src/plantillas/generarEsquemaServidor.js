import PLANTILLAS_RESPALDO from './plantillasMetadata.js'

const generarCamposServidor = (servidorTemplate) => {
  let campos = ''
  for (const campo in servidorTemplate) {
    if (Object.prototype.hasOwnProperty.call(servidorTemplate, campo)) {
      campos += `    ${campo}: String\n` // Generar la cadena de los campos
    }
  }
  return campos
}

const camposServidor = generarCamposServidor(PLANTILLAS_RESPALDO.servidor)

const esquemaServidor = `
  type Servidor {
    id: Int!
    nro_cluster: Int!
    vmid: Int!
    nombre: String!
    nodo: String!
    ip: String!
    tipo: String!
    estado: String!
    respaldo: JSON
    fecha_creacion: DateTime!
    usuario_creacion: Int!
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    servidor_contenedor: [Servidorcontenedor]!
    ${camposServidor}
  }

  type Query {
    servidors: [Servidor!]! @requireAuth
    servidor(id: Int!): Servidor @requireAuth
  }

  input CreateServidorInput {
    nro_cluster: Int!
    vmid: Int!
    nombre: String!
    nodo: String!
    ip: String!
    tipo: String!
    estado: String!
    respaldo: JSON
    usuario_creacion: Int!
    usuario_modificacion: Int
    ${camposServidor}
  }

  input UpdateServidorInput {
    nro_cluster: Int
    vmid: Int
    nombre: String
    nodo: String
    ip: String
    tipo: String
    estado: String
    respaldo: JSON
    fecha_creacion: DateTime
    usuario_creacion: Int
    fecha_modificacion: DateTime
    usuario_modificacion: Int
    ${camposServidor}
  }

  type Mutation {
    createServidor(input: CreateServidorInput!): Servidor! @requireAuth
    updateServidor(id: Int!, input: UpdateServidorInput!): Servidor!
      @requireAuth
    deleteServidor(id: Int!): Servidor! @requireAuth
  }
`

export const esquemaGenerado = esquemaServidor
