export const standard = defineScenario({
  usuario: {
    one: {
      data: {
        nombre_usuario: 'String',
        profile: { foo: 'bar' },
        telefono: { foo: 'bar' },
        correo_electronico: { foo: 'bar' },
        estado: 'ACTIVO',
        usuario_creacion: 1337526,
      },
    },
    two: {
      data: {
        nombre_usuario: 'String',
        profile: { foo: 'bar' },
        telefono: { foo: 'bar' },
        correo_electronico: { foo: 'bar' },
        estado: 'ACTIVO',
        usuario_creacion: 180740,
      },
    },
  },
})
