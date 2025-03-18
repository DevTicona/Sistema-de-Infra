import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UsuariorolForm from 'src/components/Usuariorol/UsuariorolForm'

const CREATE_USUARIOROL_MUTATION = gql`
  mutation CreateUsuariorolMutation($input: CreateUsuariorolInput!) {
    createUsuariorol(input: $input) {
      id
    }
  }
`

const NewUsuariorol = () => {
  const [createUsuariorol, { loading, error }] = useMutation(
    CREATE_USUARIOROL_MUTATION,
    {
      onCompleted: () => {
        toast.success('Usuariorol created')
        navigate(routes.usuariorols())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createUsuariorol({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Usuariorol</h2>
      </header>
      <div className="rw-segment-main">
        <UsuariorolForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewUsuariorol
