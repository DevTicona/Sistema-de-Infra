import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ServidorcontenedorForm from 'src/components/Servidorcontenedor/ServidorcontenedorForm'

const CREATE_SERVIDORCONTENEDOR_MUTATION = gql`
  mutation CreateServidorcontenedorMutation(
    $input: CreateServidorcontenedorInput!
  ) {
    createServidorcontenedor(input: $input) {
      id
    }
  }
`

const NewServidorcontenedor = () => {
  const [createServidorcontenedor, { loading, error }] = useMutation(
    CREATE_SERVIDORCONTENEDOR_MUTATION,
    {
      onCompleted: () => {
        toast.success('Servidorcontenedor created')
        navigate(routes.servidorcontenedors())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createServidorcontenedor({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          New Servidorcontenedor
        </h2>
      </header>
      <div className="rw-segment-main">
        <ServidorcontenedorForm
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default NewServidorcontenedor
