import {
  despliegues,
  despliegue,
  createDespliegue,
  updateDespliegue,
  deleteDespliegue,
} from './despliegues'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('despliegues', () => {
  scenario('returns all despliegues', async (scenario) => {
    const result = await despliegues()

    expect(result.length).toEqual(Object.keys(scenario.despliegue).length)
  })

  scenario('returns a single despliegue', async (scenario) => {
    const result = await despliegue({ id: scenario.despliegue.one.id })

    expect(result).toEqual(scenario.despliegue.one)
  })

  scenario('creates a despliegue', async (scenario) => {
    const result = await createDespliegue({
      input: {
        id_contenedor_logico: scenario.despliegue.two.id_contenedor_logico,
        sigla: 'String',
        nombre: 'String',
        descripcion: 'String',
        tipo: 'String',
        estado: 'ACTIVO',
        usuario_creacion: 794052,
      },
    })

    expect(result.id_contenedor_logico).toEqual(
      scenario.despliegue.two.id_contenedor_logico
    )
    expect(result.sigla).toEqual('String')
    expect(result.nombre).toEqual('String')
    expect(result.descripcion).toEqual('String')
    expect(result.tipo).toEqual('String')
    expect(result.estado).toEqual('ACTIVO')
    expect(result.usuario_creacion).toEqual(794052)
  })

  scenario('updates a despliegue', async (scenario) => {
    const original = await despliegue({
      id: scenario.despliegue.one.id,
    })
    const result = await updateDespliegue({
      id: original.id,
      input: { sigla: 'String2' },
    })

    expect(result.sigla).toEqual('String2')
  })

  scenario('deletes a despliegue', async (scenario) => {
    const original = await deleteDespliegue({
      id: scenario.despliegue.one.id,
    })
    const result = await despliegue({ id: original.id })

    expect(result).toEqual(null)
  })
})
