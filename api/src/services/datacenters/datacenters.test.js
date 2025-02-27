import {
  datacenters,
  datacenter,
  createDatacenter,
  updateDatacenter,
  deleteDatacenter,
} from './datacenters'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('datacenters', () => {
  scenario('returns all datacenters', async (scenario) => {
    const result = await datacenters()

    expect(result.length).toEqual(Object.keys(scenario.datacenter).length)
  })

  scenario('returns a single datacenter', async (scenario) => {
    const result = await datacenter({ id: scenario.datacenter.one.id })

    expect(result).toEqual(scenario.datacenter.one)
  })

  scenario('creates a datacenter', async () => {
    const result = await createDatacenter({
      input: { nombre: 'String', usuario_creacion: 3112083 },
    })

    expect(result.nombre).toEqual('String')
    expect(result.usuario_creacion).toEqual(3112083)
  })

  scenario('updates a datacenter', async (scenario) => {
    const original = await datacenter({
      id: scenario.datacenter.one.id,
    })
    const result = await updateDatacenter({
      id: original.id,
      input: { nombre: 'String2' },
    })

    expect(result.nombre).toEqual('String2')
  })

  scenario('deletes a datacenter', async (scenario) => {
    const original = await deleteDatacenter({
      id: scenario.datacenter.one.id,
    })
    const result = await datacenter({ id: original.id })

    expect(result).toEqual(null)
  })
})
