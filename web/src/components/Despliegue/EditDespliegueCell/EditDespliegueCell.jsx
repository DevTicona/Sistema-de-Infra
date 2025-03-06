import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import DespliegueForm from 'src/components/Despliegue/DespliegueForm'

export const QUERY = gql`
  query EditDespliegueById($id: Int!) {
    despliegue: despliegue(id: $id) {
      id
      id_componente
      id_servidor
      agrupador
      nombre
      tipo
      estado
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

const UPDATE_DESPLIEGUE_MUTATION = gql`
  mutation UpdateDespliegueMutation($id: Int!, $input: UpdateDespliegueInput!) {
    updateDespliegue(id: $id, input: $input) {
      id
      id_componente
      id_servidor
      agrupador
      nombre
      tipo
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

export const Success = ({ despliegue }) => {
  const [updateDespliegue, { loading, error }] = useMutation(
    UPDATE_DESPLIEGUE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Despliegue updated')
        navigate(routes.despliegues())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateDespliegue({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Despliegue {despliegue?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <DespliegueForm
          despliegue={despliegue}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
