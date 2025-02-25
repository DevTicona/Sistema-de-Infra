import { db } from 'src/lib/db'

export const componentes = () => {
  return db.componentes.findMany()
}

export const componente = ({ id }) => {
  return db.componentes.findUnique({
    where: { id },
  })
}

export const createComponente = ({ input }) => {
  return db.componentes.create({
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
  return db.componentes.update({
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

export const deleteComponente = ({ id }) => {
  return db.componentes.delete({
    where: { id },
  })
}

export const Componente = {
  sistemas: (_obj, { root }) => {
    return db.componentes.findUnique({ where: { id: root?.id } }).sistemas()
  },
  despliegue: (_obj, { root }) => {
    return db.componentes.findUnique({ where: { id: root?.id } }).despliegue()
  },
}
