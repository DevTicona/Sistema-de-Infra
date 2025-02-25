import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ContenedorlogicoForm from 'src/components/Contenedorlogico/ContenedorlogicoForm'

const CREATE_CONTENEDORLOGICO_MUTATION = gql`
  mutation CreateContenedorlogicoMutation(
    $input: CreateContenedorlogicoInput!
  ) {
    createContenedorlogico(input: $input) {
      id
    }
  }
`

const NewContenedorlogico = () => {
  const [createContenedorlogico, { loading, error }] = useMutation(
    CREATE_CONTENEDORLOGICO_MUTATION,
    {
      onCompleted: () => {
        toast.success('Contenedorlogico created')
        navigate(routes.contenedorlogicos())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createContenedorlogico({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          New Contenedorlogico
        </h2>
      </header>
      <div className="rw-segment-main">
        <ContenedorlogicoForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewContenedorlogico
