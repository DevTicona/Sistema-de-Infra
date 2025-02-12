import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import RolForm from 'src/components/Rol/RolForm'

const CREATE_ROL_MUTATION = gql`
  mutation CreateRolMutation($input: CreateRolInput!) {
    createRol(input: $input) {
      id
    }
  }
`

const NewRol = () => {
  const [createRol, { loading, error }] = useMutation(CREATE_ROL_MUTATION, {
    onCompleted: () => {
      toast.success('Rol created')
      navigate(routes.rols())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input) => {
    createRol({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Rol</h2>
      </header>
      <div className="rw-segment-main">
        <RolForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewRol
