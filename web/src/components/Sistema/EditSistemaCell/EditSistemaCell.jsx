import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import SistemaForm from 'src/components/Sistema/SistemaForm'

export const QUERY = gql`
  query EditSistemaById($id: Int!) {
    sistema: sistema(id: $id) {
      id
      id_padre
      id_entidad
      codigo
      sigla
      nombre
      descripcion
      estado
      respaldo_creacion
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

const UPDATE_SISTEMA_MUTATION = gql`
  mutation UpdateSistemaMutation($id: Int!, $input: UpdateSistemaInput!) {
    updateSistema(id: $id, input: $input) {
      id
      id_padre
      id_entidad
      codigo
      sigla
      nombre
      descripcion
      estado
      respaldo_creacion
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

export const Success = ({ sistema }) => {
  const [updateSistema, { loading, error }] = useMutation(
    UPDATE_SISTEMA_MUTATION,
    {
      onCompleted: () => {
        toast.success('Sistema updated')
        navigate(routes.sistemas())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateSistema({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Sistema {sistema?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <SistemaForm
          sistema={sistema}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
