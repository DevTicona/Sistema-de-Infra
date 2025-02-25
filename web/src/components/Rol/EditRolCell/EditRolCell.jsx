import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import RolForm from 'src/components/Rol/RolForm'

export const QUERY = gql`
  query EditRolById($id: Int!) {
    rol: rol(id: $id) {
      id
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

const UPDATE_ROL_MUTATION = gql`
  mutation UpdateRolMutation($id: Int!, $input: UpdateRolInput!) {
    updateRol(id: $id, input: $input) {
      id
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

export const Success = ({ rol }) => {
  const [updateRol, { loading, error }] = useMutation(UPDATE_ROL_MUTATION, {
    onCompleted: () => {
      toast.success('Rol updated')
      navigate(routes.rols())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input, id) => {
    updateRol({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Rol {rol?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <RolForm rol={rol} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
