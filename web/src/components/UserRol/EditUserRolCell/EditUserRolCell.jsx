import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UserRolForm from 'src/components/UserRol/UserRolForm'

export const QUERY = gql`
  query EditUserRolById($id: Int!) {
    userRol: userRol(id: $id) {
      id
      userId
      roleId
    }
  }
`

const UPDATE_USER_ROL_MUTATION = gql`
  mutation UpdateUserRolMutation($id: Int!, $input: UpdateUserRolInput!) {
    updateUserRol(id: $id, input: $input) {
      id
      userId
      roleId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ userRol }) => {
  const [updateUserRol, { loading, error }] = useMutation(
    UPDATE_USER_ROL_MUTATION,
    {
      onCompleted: () => {
        toast.success('UserRol updated')
        navigate(routes.userRols())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateUserRol({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit UserRol {userRol?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <UserRolForm
          userRol={userRol}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
