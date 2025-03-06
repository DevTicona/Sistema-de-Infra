import {
  usuariorols,
  usuariorol,
  createUsuariorol,
  updateUsuariorol,
  deleteUsuariorol,
} from './usuariorols'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('usuariorols', () => {
  scenario('returns all usuariorols', async (scenario) => {
    const result = await usuariorols()

    expect(result.length).toEqual(Object.keys(scenario.usuariorol).length)
  })

  scenario('returns a single usuariorol', async (scenario) => {
    const result = await usuariorol({ id: scenario.usuariorol.one.id })

    expect(result).toEqual(scenario.usuariorol.one)
  })

  scenario('creates a usuariorol', async (scenario) => {
    const result = await createUsuariorol({
      input: {
        id_rol: scenario.usuariorol.two.id_rol,
        id_despliegue: scenario.usuariorol.two.id_despliegue,
        id_sistema: scenario.usuariorol.two.id_sistema,
        estado: 'ACTIVO',
        usuario_creacion: 4940934,
      },
    })

    expect(result.id_rol).toEqual(scenario.usuariorol.two.id_rol)
    expect(result.id_despliegue).toEqual(scenario.usuariorol.two.id_despliegue)
    expect(result.id_sistema).toEqual(scenario.usuariorol.two.id_sistema)
    expect(result.estado).toEqual('ACTIVO')
    expect(result.usuario_creacion).toEqual(4940934)
  })

  scenario('updates a usuariorol', async (scenario) => {
    const original = await usuariorol({
      id: scenario.usuariorol.one.id,
    })
    const result = await updateUsuariorol({
      id: original.id,
      input: { estado: 'INACTIVO' },
    })

    expect(result.estado).toEqual('INACTIVO')
  })

  scenario('deletes a usuariorol', async (scenario) => {
    const original = await deleteUsuariorol({
      id: scenario.usuariorol.one.id,
    })
    const result = await usuariorol({ id: original.id })

    expect(result).toEqual(null)
  })
})
