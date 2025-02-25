import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ServidorForm from 'src/components/Servidor/ServidorForm'

const CREATE_SERVIDOR_MUTATION = gql`
  mutation CreateServidorMutation($input: CreateServidorInput!) {
    createServidor(input: $input) {
      id
    }
  }
`

const NewServidor = () => {
  const [createServidor, { loading, error }] = useMutation(
    CREATE_SERVIDOR_MUTATION,
    {
      onCompleted: () => {
        toast.success('Servidor created')
        navigate(routes.servidors())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createServidor({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Servidor</h2>
      </header>
      <div className="rw-segment-main">
        <ServidorForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewServidor
