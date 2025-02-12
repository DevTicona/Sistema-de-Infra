import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UsuarioForm from 'src/components/Usuario/UsuarioForm'

export const QUERY = gql`
  query EditUsuarioById($id: Int!) {
    usuario: usuario(id: $id) {
      id
      uuid_ciudadano
      nombre_usuario
      profile
      telefono
      correo_electronico
      estado
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

const UPDATE_USUARIO_MUTATION = gql`
  mutation UpdateUsuarioMutation($id: Int!, $input: UpdateUsuarioInput!) {
    updateUsuario(id: $id, input: $input) {
      id
      uuid_ciudadano
      nombre_usuario
      profile
      telefono
      correo_electronico
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

export const Success = ({ usuario }) => {
  const [updateUsuario, { loading, error }] = useMutation(
    UPDATE_USUARIO_MUTATION,
    {
      onCompleted: () => {
        toast.success('Usuario updated')
        navigate(routes.usuarios())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateUsuario({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Usuario {usuario?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <UsuarioForm
          usuario={usuario}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
