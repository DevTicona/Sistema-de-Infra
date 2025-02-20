import {
  sistemas,
  sistema,
  createSistema,
  updateSistema,
  deleteSistema,
} from './sistemas'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('sistemas', () => {
  scenario('returns all sistemas', async (scenario) => {
    const result = await sistemas()

    expect(result.length).toEqual(Object.keys(scenario.sistema).length)
  })

  scenario('returns a single sistema', async (scenario) => {
    const result = await sistema({ id: scenario.sistema.one.id })

    expect(result).toEqual(scenario.sistema.one)
  })

  scenario('creates a sistema', async (scenario) => {
    const result = await createSistema({
      input: {
        id_entidad: scenario.sistema.two.id_entidad,
        codigo: 'String',
        sigla: 'String',
        nombre: 'String',
        descripcion: 'String',
        estado: 'ACTIVO',
        usuario_creacion: 289370,
      },
    })

    expect(result.id_entidad).toEqual(scenario.sistema.two.id_entidad)
    expect(result.codigo).toEqual('String')
    expect(result.sigla).toEqual('String')
    expect(result.nombre).toEqual('String')
    expect(result.descripcion).toEqual('String')
    expect(result.estado).toEqual('ACTIVO')
    expect(result.usuario_creacion).toEqual(289370)
  })

  scenario('updates a sistema', async (scenario) => {
    const original = await sistema({ id: scenario.sistema.one.id })
    const result = await updateSistema({
      id: original.id,
      input: { codigo: 'String2' },
    })

    expect(result.codigo).toEqual('String2')
  })

  scenario('deletes a sistema', async (scenario) => {
    const original = await deleteSistema({
      id: scenario.sistema.one.id,
    })
    const result = await sistema({ id: original.id })

    expect(result).toEqual(null)
  })
})
