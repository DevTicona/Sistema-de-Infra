import { db } from 'src/lib/db'
import * as yup from 'yup'

// Esquema de validación
const componenteSchema = yup.object({
  id_sistema: yup.number().required(),
  nombre: yup.string().required().max(30),
  descripcion: yup.string().required(),
  estado: yup.string().oneOf(['ACTIVO', 'INACTIVO']).required(),
  entorno: yup.string().oneOf(['Demo', 'PreProd', 'Prod', 'Test']).required(),
  categoria: yup.string().oneOf(['Backend', 'Frontend', 'Database', 'NFS']).required(),
})

export const componentes = () => {
  return db.componentes.findMany({
    include: {
      sistemas: true,
      despliegue: true,
    },
  })
}

export const componente = ({ id }) => {
  return db.componentes.findUnique({
    where: { id },
    include: {
      sistemas: true,
      despliegue: true,
    },
  })
}

export const createComponente = async ({ input }) => {
  await componenteSchema.validate(input)
  return db.componentes.create({
    data: {
      ...input,
      fecha_creacion: new Date(),
      fecha_modificacion: new Date(),
      usuario_creacion: context.currentUser.id,
      usuario_modificacion: context.currentUser.id,
    },
  })
}

export const updateComponente = ({ id, input }) => {
  return db.componentes.update({
    where: { id },
    data: {
      ...input,
      fecha_modificacion: new Date(),
      usuario_modificacion: context.currentUser.id,
    },
  })
}

export const deleteComponente = ({ id }) => {
  return db.componentes.delete({
    where: { id },
  })
}
