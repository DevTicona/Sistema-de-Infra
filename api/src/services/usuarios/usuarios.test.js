import {
  usuarios,
  usuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from './usuarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('usuarios', () => {
  scenario('returns all usuarios', async (scenario) => {
    const result = await usuarios()

    expect(result.length).toEqual(Object.keys(scenario.usuario).length)
  })

  scenario('returns a single usuario', async (scenario) => {
    const result = await usuario({ id: scenario.usuario.one.id })

    expect(result).toEqual(scenario.usuario.one)
  })

  scenario('creates a usuario', async () => {
    const result = await createUsuario({
      input: {
        nombre_usuario: 'String',
        profile: { foo: 'bar' },
        telefono: { foo: 'bar' },
        correo_electronico: { foo: 'bar' },
        estado: 'String',
        usuario_creacion: 6891469,
      },
    })

    expect(result.nombre_usuario).toEqual('String')
    expect(result.profile).toEqual({ foo: 'bar' })
    expect(result.telefono).toEqual({ foo: 'bar' })
    expect(result.correo_electronico).toEqual({ foo: 'bar' })
    expect(result.estado).toEqual('String')
    expect(result.usuario_creacion).toEqual(6891469)
  })

  scenario('updates a usuario', async (scenario) => {
    const original = await usuario({ id: scenario.usuario.one.id })
    const result = await updateUsuario({
      id: original.id,
      input: { nombre_usuario: 'String2' },
    })

    expect(result.nombre_usuario).toEqual('String2')
  })

  scenario('deletes a usuario', async (scenario) => {
    const original = await deleteUsuario({
      id: scenario.usuario.one.id,
    })
    const result = await usuario({ id: original.id })

    expect(result).toEqual(null)
  })
})
