import {
  cuchillas,
  cuchilla,
  createCuchilla,
  updateCuchilla,
  deleteCuchilla,
} from './cuchillas'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('cuchillas', () => {
  scenario('returns all cuchillas', async (scenario) => {
    const result = await cuchillas()

    expect(result.length).toEqual(Object.keys(scenario.cuchilla).length)
  })

  scenario('returns a single cuchilla', async (scenario) => {
    const result = await cuchilla({ id: scenario.cuchilla.one.id })

    expect(result).toEqual(scenario.cuchilla.one)
  })

  scenario('creates a cuchilla', async (scenario) => {
    const result = await createCuchilla({
      input: {
        id_rack: scenario.cuchilla.two.id_rack,
        nombre: 'String',
        usuario_creacion: 6215749,
      },
    })

    expect(result.id_rack).toEqual(scenario.cuchilla.two.id_rack)
    expect(result.nombre).toEqual('String')
    expect(result.usuario_creacion).toEqual(6215749)
  })

  scenario('updates a cuchilla', async (scenario) => {
    const original = await cuchilla({
      id: scenario.cuchilla.one.id,
    })
    const result = await updateCuchilla({
      id: original.id,
      input: { nombre: 'String2' },
    })

    expect(result.nombre).toEqual('String2')
  })

  scenario('deletes a cuchilla', async (scenario) => {
    const original = await deleteCuchilla({
      id: scenario.cuchilla.one.id,
    })
    const result = await cuchilla({ id: original.id })

    expect(result).toEqual(null)
  })
})
