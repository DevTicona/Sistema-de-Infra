import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ComponenteForm from 'src/components/Componente/ComponenteForm'

export const QUERY = gql`
  query EditComponenteById($id: Int!) {
    componente: componente(id: $id) {
      id
      id_sistema
      nombre
      descripcion
      estado
      entorno
      categoria
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

const UPDATE_COMPONENTE_MUTATION = gql`
  mutation UpdateComponenteMutation($id: Int!, $input: UpdateComponenteInput!) {
    updateComponente(id: $id, input: $input) {
      id
      id_sistema
      nombre
      descripcion
      estado
      entorno
      categoria
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

export const Success = ({ componente }) => {
  const [updateComponente, { loading, error }] = useMutation(
    UPDATE_COMPONENTE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Componente updated')
        navigate(routes.componentes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateComponente({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Componente {componente?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ComponenteForm
          componente={componente}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
