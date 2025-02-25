export const standard = defineScenario({
  cuchilla: {
    one: {
      data: {
        nombre: 'String',
        usuario_creacion: 7611119,
        racks: {
          create: {
            nombre: 'String',
            usuario_creacion: 3646500,
            data_centers: {
              create: { nombre: 'String', usuario_creacion: 6830700 },
            },
          },
        },
      },
    },
    two: {
      data: {
        nombre: 'String',
        usuario_creacion: 8326514,
        racks: {
          create: {
            nombre: 'String',
            usuario_creacion: 3348598,
            data_centers: {
              create: { nombre: 'String', usuario_creacion: 9716665 },
            },
          },
        },
      },
    },
  },
})
