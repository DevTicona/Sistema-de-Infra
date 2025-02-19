import { db } from 'src/lib/db'

export const componentes = () => {
  return db.componente.findMany()
}

export const componente = ({ id }) => {
  return db.componente.findUnique({
    where: { id },
  })
}

export const createComponente = ({ input }) => {
  return db.componente.create({
    data: {
      id_sistema: input.id_sistema,
      nombre: input.nombre,
      descripcion: input.descripcion,
      estado: input.estado,
      entorno: input.entorno,
      categoria: input.categoria,
      fecha_creacion: new Date(),
      usuario_creacion: input.usuario_creacion,
    },
  })
}

export const updateComponente = ({ id, input }) => {
  return db.componente.update({
    data: {
      id_sistema: input.id_sistema,
      nombre: input.nombre,
      descripcion: input.descripcion,
      estado: input.estado,
      entorno: input.entorno,
      categoria: input.categoria,
      fecha_modificacion: new Date(),
      usuario_modificacion: input.usuario_modificacion,
    },
    where: { id },
  })
}

export const deleteComponente = async ({ id }) => {
  await db.despliegue.deleteMany({ where: { id_componente: id } })
  return db.componente.delete({
    where: { id },
  })
}

export const Componente = {
  sistemas: (_obj, { root }) => {
    return db.componente.findUnique({ where: { id: root?.id } }).sistemas()
  },
  despliegue: (_obj, { root }) => {
    return db.componente.findUnique({ where: { id: root?.id } }).despliegue()
  },
}
