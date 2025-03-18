import { db } from 'src/lib/db'

export const servidors = () => {
  return db.servidores.findMany()
}

export const servidor = ({ id }) => {
  return db.servidores.findUnique({
    where: { id },
    include: {
      data_centers: true,
      despliegue: {
        include: {
          componentes: {
            include: {
              sistemas: true,
            },
          },
        },
      },
    },
  })
}

export const createServidor = ({ input }) => {
  const metadataData = {
    blade: input.blade,
    chasis: input.chasis,
    almacenamiento: input.almacenamiento,
    procesador: input.procesador,
    sistema_operativo: input.sistema_operativo,
    memoria_ram: input.memoria_ram,
  }

  return db.servidores.create({
    data: {
      nro_cluster: input.nro_cluster,
      vmid: input.vmid,
      nombre: input.nombre,
      nodo: input.nodo,
      ip: input.ip,
      tipo: input.tipo,
      estado: input.estado,
      metadata: metadataData,
      fecha_creacion: new Date(),
      usuario_creacion: 1,
      id_data_center: input.id_data_center,
    },
  })
}

export const updateServidor = ({ id, input }) => {
  const metadataData = {
    blade: input.blade,
    chasis: input.chasis,
    almacenamiento: input.almacenamiento,
    procesador: input.procesador,
    sistema_operativo: input.sistema_operativo,
    memoria_ram: input.memoria_ram,
  }

  return db.servidores.update({
    data: {
      nro_cluster: input.nro_cluster,
      vmid: input.vmid,
      nombre: input.nombre,
      nodo: input.nodo,
      ip: input.ip,
      tipo: input.tipo,
      estado: input.estado,
      metadata: metadataData,
      usuario_modificacion: input.usuario_modificacion,
      fecha_modificacion: new Date(),
      id_data_center: input.id_data_center,
    },
    where: { id },
  })
}

export const deleteServidor = ({ id }) => {
  return db.servidores.delete({
    where: { id },
  })
}
export const servidorsCount = ({ where }) => {
  return db.servidores.count({ where })
}
export const Servidor = {
  despliegue: (_obj, { root }) => {
    return db.servidores.findUnique({ where: { id: root?.id } }).despliegue()
  },
  data_centers: (_obj, { root }) => {
    return db.servidores.findUnique({ where: { id: root?.id } }).data_centers()
  },
}
