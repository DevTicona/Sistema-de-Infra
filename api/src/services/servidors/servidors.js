import { db } from 'src/lib/db'

export const servidors = () => {
  return db.servidores.findMany()
}

export const servidor = ({ id }) => {
  return db.servidores.findUnique({
    where: { id },
  })
}

export const createServidor = ({ input }) => {
  const respaldoData = {
    sistema_operativo: input.sistema_operativo,
    version_kernel: input.version_kernel,
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
      metadata: respaldoData,
      fecha_creacion: new Date(),
      usuario_creacion: input.usuario_creacion,
      id_cuchilla: input.id_cuchilla,
    },
  })
}

export const updateServidor = ({ id, input }) => {
  const respaldoData = {
    sistema_operativo: input.sistema_operativo,
    version_kernel: input.version_kernel,
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
      metadata: respaldoData,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
      id_cuchilla: input.id_cuchilla,
    },
    where: { id },
  })
}

export const deleteServidor = ({ id }) => {
  return db.servidores.delete({
    where: { id },
  })
}

export const Servidor = {
  servidor_contenedor: (_obj, { root }) => {
    return db.servidores
      .findUnique({ where: { id: root?.id } })
      .servidor_contenedor()
  },
  cuchillas: (_obj, { root }) => {
    return db.servidores.findUnique({ where: { id: root?.id } }).cuchillas()
  },
}
