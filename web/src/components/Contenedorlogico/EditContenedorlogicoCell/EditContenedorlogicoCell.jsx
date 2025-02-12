import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ContenedorlogicoForm from 'src/components/Contenedorlogico/ContenedorlogicoForm'

export const QUERY = gql`
  query EditContenedorlogicoById($id: Int!) {
    contenedorlogico: contenedorlogico(id: $id) {
      id
      id_padre
      codigo
      sigla
      nombre
      descripcion
      tipo
      estado
      respaldo
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

const UPDATE_CONTENEDORLOGICO_MUTATION = gql`
  mutation UpdateContenedorlogicoMutation(
    $id: Int!
    $input: UpdateContenedorlogicoInput!
  ) {
    updateContenedorlogico(id: $id, input: $input) {
      id
      id_padre
      codigo
      sigla
      nombre
      descripcion
      tipo
      estado
      respaldo
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ contenedorlogico }) => {
  const [updateContenedorlogico, { loading, error }] = useMutation(
    UPDATE_CONTENEDORLOGICO_MUTATION,
    {
      onCompleted: () => {
        toast.success('Contenedorlogico updated')
        navigate(routes.contenedorlogicos())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateContenedorlogico({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Contenedorlogico {contenedorlogico?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ContenedorlogicoForm
          contenedorlogico={contenedorlogico}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
