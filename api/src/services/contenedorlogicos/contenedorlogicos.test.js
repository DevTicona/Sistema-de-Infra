import {
  contenedorlogicos,
  contenedorlogico,
  createContenedorlogico,
  updateContenedorlogico,
  deleteContenedorlogico,
} from './contenedorlogicos'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('contenedorlogicos', () => {
  scenario('returns all contenedorlogicos', async (scenario) => {
    const result = await contenedorlogicos()

    expect(result.length).toEqual(Object.keys(scenario.contenedorlogico).length)
  })

  scenario('returns a single contenedorlogico', async (scenario) => {
    const result = await contenedorlogico({
      id: scenario.contenedorlogico.one.id,
    })

    expect(result).toEqual(scenario.contenedorlogico.one)
  })

  scenario('creates a contenedorlogico', async () => {
    const result = await createContenedorlogico({
      input: {
        codigo: 'String',
        nombre: 'String',
        descripcion: 'String',
        tipo: 'String',
        estado: 'ACTIVO',
        usuario_creacion: 8296693,
      },
    })

    expect(result.codigo).toEqual('String')
    expect(result.nombre).toEqual('String')
    expect(result.descripcion).toEqual('String')
    expect(result.tipo).toEqual('String')
    expect(result.estado).toEqual('ACTIVO')
    expect(result.usuario_creacion).toEqual(8296693)
  })

  scenario('updates a contenedorlogico', async (scenario) => {
    const original = await contenedorlogico({
      id: scenario.contenedorlogico.one.id,
    })
    const result = await updateContenedorlogico({
      id: original.id,
      input: { codigo: 'String2' },
    })

    expect(result.codigo).toEqual('String2')
  })

  scenario('deletes a contenedorlogico', async (scenario) => {
    const original = await deleteContenedorlogico({
      id: scenario.contenedorlogico.one.id,
    })
    const result = await contenedorlogico({ id: original.id })

    expect(result).toEqual(null)
  })
})
