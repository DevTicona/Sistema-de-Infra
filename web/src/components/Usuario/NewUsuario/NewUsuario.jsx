import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UsuarioForm from 'src/components/Usuario/UsuarioForm'

const CREATE_USUARIO_MUTATION = gql`
  mutation CreateUsuarioMutation($input: CreateUsuarioInput!) {
    createUsuario(input: $input) {
      id
    }
  }
`

const NewUsuario = () => {
  const [createUsuario, { loading, error }] = useMutation(
    CREATE_USUARIO_MUTATION,
    {
      onCompleted: () => {
        toast.success('Usuario created')
        navigate(routes.usuarios())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createUsuario({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Usuario</h2>
      </header>
      <div className="rw-segment-main">
        <UsuarioForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewUsuario
