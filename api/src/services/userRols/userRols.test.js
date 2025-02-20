import {
  userRols,
  userRol,
  createUserRol,
  updateUserRol,
  deleteUserRol,
} from './userRols'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('userRols', () => {
  scenario('returns all userRols', async (scenario) => {
    const result = await userRols()

    expect(result.length).toEqual(Object.keys(scenario.userRol).length)
  })

  scenario('returns a single userRol', async (scenario) => {
    const result = await userRol({ id: scenario.userRol.one.id })

    expect(result).toEqual(scenario.userRol.one)
  })

  scenario('creates a userRol', async (scenario) => {
    const result = await createUserRol({
      input: {
        userId: scenario.userRol.two.userId,
        roleId: scenario.userRol.two.roleId,
      },
    })

    expect(result.userId).toEqual(scenario.userRol.two.userId)
    expect(result.roleId).toEqual(scenario.userRol.two.roleId)
  })

  scenario('updates a userRol', async (scenario) => {
    const original = await userRol({ id: scenario.userRol.one.id })
    const result = await updateUserRol({
      id: original.id,
      input: { roleId: scenario.userRol.two.userId },
    })

    expect(result.roleId).toEqual(scenario.userRol.two.userId)
  })

  scenario('deletes a userRol', async (scenario) => {
    const original = await deleteUserRol({
      id: scenario.userRol.one.id,
    })
    const result = await userRol({ id: original.id })

    expect(result).toEqual(null)
  })
})
