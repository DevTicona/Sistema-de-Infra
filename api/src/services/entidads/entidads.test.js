import {
  entidads,
  entidad,
  createEntidad,
  updateEntidad,
  deleteEntidad,
} from './entidads'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('entidads', () => {
  scenario('returns all entidads', async (scenario) => {
    const result = await entidads()

    expect(result.length).toEqual(Object.keys(scenario.entidad).length)
  })

  scenario('returns a single entidad', async (scenario) => {
    const result = await entidad({ id: scenario.entidad.one.id })

    expect(result).toEqual(scenario.entidad.one)
  })

  scenario('creates a entidad', async () => {
    const result = await createEntidad({
      input: {
        codigo: 'String',
        sigla: 'String',
        nombre: 'String',
        tipo: 'String',
        estado: 'String',
        usuario_creacion: 2771910,
      },
    })

    expect(result.codigo).toEqual('String')
    expect(result.sigla).toEqual('String')
    expect(result.nombre).toEqual('String')
    expect(result.tipo).toEqual('String')
    expect(result.estado).toEqual('String')
    expect(result.usuario_creacion).toEqual(2771910)
  })

  scenario('updates a entidad', async (scenario) => {
    const original = await entidad({ id: scenario.entidad.one.id })
    const result = await updateEntidad({
      id: original.id,
      input: { codigo: 'String2' },
    })

    expect(result.codigo).toEqual('String2')
  })

  scenario('deletes a entidad', async (scenario) => {
    const original = await deleteEntidad({
      id: scenario.entidad.one.id,
    })
    const result = await entidad({ id: original.id })

    expect(result).toEqual(null)
  })
})
