import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import SistemaForm from 'src/components/Sistema/SistemaForm'

const CREATE_SISTEMA_MUTATION = gql`
  mutation CreateSistemaMutation($input: CreateSistemaInput!) {
    createSistema(input: $input) {
      id
    }
  }
`

const NewSistema = () => {
  const [createSistema, { loading, error }] = useMutation(
    CREATE_SISTEMA_MUTATION,
    {
      onCompleted: () => {
        toast.success('Sistema created')
        navigate(routes.sistemas())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createSistema({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Sistema</h2>
      </header>
      <div className="rw-segment-main">
        <SistemaForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewSistema
