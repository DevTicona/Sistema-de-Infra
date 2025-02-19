import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import EntidadForm from 'src/components/Entidad/EntidadForm'

export const QUERY = gql`
  query EditEntidadById($id: Int!) {
    entidad: entidad(id: $id) {
      id
      codigo
      sigla
      nombre
      estado
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

const UPDATE_ENTIDAD_MUTATION = gql`
  mutation UpdateEntidadMutation($id: Int!, $input: UpdateEntidadInput!) {
    updateEntidad(id: $id, input: $input) {
      id
      codigo
      sigla
      nombre
      estado
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

export const Success = ({ entidad }) => {
  const [updateEntidad, { loading, error }] = useMutation(
    UPDATE_ENTIDAD_MUTATION,
    {
      onCompleted: () => {
        toast.success('Entidad updated')
        navigate(routes.entidads())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateEntidad({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Entidad {entidad?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <EntidadForm
          entidad={entidad}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
