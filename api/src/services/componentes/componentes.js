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
    data: input,
  })
}

export const updateComponente = ({ id, input }) => {
  return db.componentes.update({
    data: input,
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
