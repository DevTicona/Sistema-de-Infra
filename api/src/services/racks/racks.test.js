import { racks, rack, createRack, updateRack, deleteRack } from './racks'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('racks', () => {
  scenario('returns all racks', async (scenario) => {
    const result = await racks()

    expect(result.length).toEqual(Object.keys(scenario.rack).length)
  })

  scenario('returns a single rack', async (scenario) => {
    const result = await rack({ id: scenario.rack.one.id })

    expect(result).toEqual(scenario.rack.one)
  })

  scenario('creates a rack', async (scenario) => {
    const result = await createRack({
      input: {
        id_data_center: scenario.rack.two.id_data_center,
        nombre: 'String',
        usuario_creacion: 3994504,
      },
    })

    expect(result.id_data_center).toEqual(scenario.rack.two.id_data_center)
    expect(result.nombre).toEqual('String')
    expect(result.usuario_creacion).toEqual(3994504)
  })

  scenario('updates a rack', async (scenario) => {
    const original = await rack({ id: scenario.rack.one.id })
    const result = await updateRack({
      id: original.id,
      input: { nombre: 'String2' },
    })

    expect(result.nombre).toEqual('String2')
  })

  scenario('deletes a rack', async (scenario) => {
    const original = await deleteRack({ id: scenario.rack.one.id })
    const result = await rack({ id: original.id })

    expect(result).toEqual(null)
  })
})
