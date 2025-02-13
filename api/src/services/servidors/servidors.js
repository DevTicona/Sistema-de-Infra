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
  return db.servidores.create({
    data: {
      nro_cluster: input.nro_cluster,
      vmid: input.vmid,
      nombre: input.nombre,
      nodo: input.nodo,
      ip: input.ip,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: input.respaldo,
      fecha_creacion: new Date(),
      usuario_creacion: input.usuario_creacion,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
  })
}

export const updateServidor = ({ id, input }) => {
  return db.servidores.update({
    data: {
      nro_cluster: input.nro_cluster,
      vmid: input.vmid,
      nombre: input.nombre,
      nodo: input.nodo,
      ip: input.ip,
      tipo: input.tipo,
      estado: input.estado,
      respaldo: input.respaldo,
      usuario_creacion: input.usuario_creacion,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
    where: { id },
  })
}

export const deleteServidor = async ({ id }) => {
  await db.servidor_contenedor.deleteMany({ where: { id_servidor: id } })
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
}
