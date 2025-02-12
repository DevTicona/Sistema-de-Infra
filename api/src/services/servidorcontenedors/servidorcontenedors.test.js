import {
  servidorcontenedors,
  servidorcontenedor,
  createServidorcontenedor,
  updateServidorcontenedor,
  deleteServidorcontenedor,
} from './servidorcontenedors'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('servidorcontenedors', () => {
  scenario('returns all servidorcontenedors', async (scenario) => {
    const result = await servidorcontenedors()

    expect(result.length).toEqual(
      Object.keys(scenario.servidorcontenedor).length
    )
  })

  scenario('returns a single servidorcontenedor', async (scenario) => {
    const result = await servidorcontenedor({
      id: scenario.servidorcontenedor.one.id,
    })

    expect(result).toEqual(scenario.servidorcontenedor.one)
  })

  scenario('creates a servidorcontenedor', async () => {
    const result = await createServidorcontenedor({
      input: {
        sigla: 'String',
        nombre: 'String',
        descripcion: 'String',
        tipo: 'String',
        estado: 'String',
        usuario_creacion: 4501275,
      },
    })

    expect(result.sigla).toEqual('String')
    expect(result.nombre).toEqual('String')
    expect(result.descripcion).toEqual('String')
    expect(result.tipo).toEqual('String')
    expect(result.estado).toEqual('String')
    expect(result.usuario_creacion).toEqual(4501275)
  })

  scenario('updates a servidorcontenedor', async (scenario) => {
    const original = await servidorcontenedor({
      id: scenario.servidorcontenedor.one.id,
    })
    const result = await updateServidorcontenedor({
      id: original.id,
      input: { sigla: 'String2' },
    })

    expect(result.sigla).toEqual('String2')
  })

  scenario('deletes a servidorcontenedor', async (scenario) => {
    const original = await deleteServidorcontenedor({
      id: scenario.servidorcontenedor.one.id,
    })
    const result = await servidorcontenedor({ id: original.id })

    expect(result).toEqual(null)
  })
})
