import {
  componentes,
  componente,
  createComponente,
  updateComponente,
  deleteComponente,
} from './componentes'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('componentes', () => {
  scenario('returns all componentes', async (scenario) => {
    const result = await componentes()

    expect(result.length).toEqual(Object.keys(scenario.componente).length)
  })

  scenario('returns a single componente', async (scenario) => {
    const result = await componente({ id: scenario.componente.one.id })

    expect(result).toEqual(scenario.componente.one)
  })

  scenario('creates a componente', async (scenario) => {
    const result = await createComponente({
      input: {
        id_sistema: scenario.componente.two.id_sistema,
        nombre: 'String',
        descripcion: 'String',
        estado: 'String',
        entorno: 'String',
        categoria: 'String',
        usuario_creacion: 7013233,
      },
    })

    expect(result.id_sistema).toEqual(scenario.componente.two.id_sistema)
    expect(result.nombre).toEqual('String')
    expect(result.descripcion).toEqual('String')
    expect(result.estado).toEqual('String')
    expect(result.entorno).toEqual('String')
    expect(result.categoria).toEqual('String')
    expect(result.usuario_creacion).toEqual(7013233)
  })

  scenario('updates a componente', async (scenario) => {
    const original = await componente({
      id: scenario.componente.one.id,
    })
    const result = await updateComponente({
      id: original.id,
      input: { nombre: 'String2' },
    })

    expect(result.nombre).toEqual('String2')
  })

  scenario('deletes a componente', async (scenario) => {
    const original = await deleteComponente({
      id: scenario.componente.one.id,
    })
    const result = await componente({ id: original.id })

    expect(result).toEqual(null)
  })
})
