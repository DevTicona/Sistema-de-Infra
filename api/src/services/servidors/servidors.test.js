import {
  servidors,
  servidor,
  createServidor,
  updateServidor,
  deleteServidor,
} from './servidors'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('servidors', () => {
  scenario('returns all servidors', async (scenario) => {
    const result = await servidors()

    expect(result.length).toEqual(Object.keys(scenario.servidor).length)
  })

  scenario('returns a single servidor', async (scenario) => {
    const result = await servidor({ id: scenario.servidor.one.id })

    expect(result).toEqual(scenario.servidor.one)
  })

  scenario('creates a servidor', async () => {
    const result = await createServidor({
      input: {
        nro_cluster: 9691510,
        vmid: 5689526,
        nombre: 'String',
        nodo: 'String',
        ip: 'String',
        tipo: 'String',
        estado: 'ACTIVO',
        usuario_creacion: 9399229,
      },
    })

    expect(result.nro_cluster).toEqual(9691510)
    expect(result.vmid).toEqual(5689526)
    expect(result.nombre).toEqual('String')
    expect(result.nodo).toEqual('String')
    expect(result.ip).toEqual('String')
    expect(result.tipo).toEqual('String')
    expect(result.estado).toEqual('ACTIVO')
    expect(result.usuario_creacion).toEqual(9399229)
  })

  scenario('updates a servidor', async (scenario) => {
    const original = await servidor({
      id: scenario.servidor.one.id,
    })
    const result = await updateServidor({
      id: original.id,
      input: { nro_cluster: 489486 },
    })

    expect(result.nro_cluster).toEqual(489486)
  })

  scenario('deletes a servidor', async (scenario) => {
    const original = await deleteServidor({
      id: scenario.servidor.one.id,
    })
    const result = await servidor({ id: original.id })

    expect(result).toEqual(null)
  })
})
