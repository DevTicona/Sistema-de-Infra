import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import UserRolForm from 'src/components/UserRol/UserRolForm'

const CREATE_USER_ROL_MUTATION = gql`
  mutation CreateUserRolMutation($input: CreateUserRolInput!) {
    createUserRol(input: $input) {
      id
    }
  }
`

const NewUserRol = () => {
  const [createUserRol, { loading, error }] = useMutation(
    CREATE_USER_ROL_MUTATION,
    {
      onCompleted: () => {
        toast.success('UserRol created')
        navigate(routes.userRols())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createUserRol({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New UserRol</h2>
      </header>
      <div className="rw-segment-main">
        <UserRolForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewUserRol
