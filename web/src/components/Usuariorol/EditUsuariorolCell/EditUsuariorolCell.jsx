import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UsuariorolForm from 'src/components/Usuariorol/UsuariorolForm'

export const QUERY = gql`
  query EditUsuariorolById($id: Int!) {
    usuariorol: usuariorol(id: $id) {
      id
      id_usuario
      id_rol
      id_contenedor_logico
      id_sistema
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

const UPDATE_USUARIOROL_MUTATION = gql`
  mutation UpdateUsuariorolMutation($id: Int!, $input: UpdateUsuariorolInput!) {
    updateUsuariorol(id: $id, input: $input) {
      id
      id_usuario
      id_rol
      id_contenedor_logico
      id_sistema
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

export const Success = ({ usuariorol }) => {
  const [updateUsuariorol, { loading, error }] = useMutation(
    UPDATE_USUARIOROL_MUTATION,
    {
      onCompleted: () => {
        toast.success('Usuariorol updated')
        navigate(routes.usuariorols())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateUsuariorol({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Usuariorol {usuariorol?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <UsuariorolForm
          usuariorol={usuariorol}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
