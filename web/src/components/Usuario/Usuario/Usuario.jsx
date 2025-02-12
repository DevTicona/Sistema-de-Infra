import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { jsonDisplay, timeTag } from 'src/lib/formatters'

const DELETE_USUARIO_MUTATION = gql`
  mutation DeleteUsuarioMutation($id: Int!) {
    deleteUsuario(id: $id) {
      id
    }
  }
`

const Usuario = ({ usuario }) => {
  const [deleteUsuario] = useMutation(DELETE_USUARIO_MUTATION, {
    onCompleted: () => {
      toast.success('Usuario deleted')
      navigate(routes.usuarios())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete usuario ' + id + '?')) {
      deleteUsuario({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Usuario {usuario.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{usuario.id}</td>
            </tr>
            <tr>
              <th>Uuid ciudadano</th>
              <td>{usuario.uuid_ciudadano}</td>
            </tr>
            <tr>
              <th>Nombre usuario</th>
              <td>{usuario.nombre_usuario}</td>
            </tr>
            <tr>
              <th>Profile</th>
              <td>{jsonDisplay(usuario.profile)}</td>
            </tr>
            <tr>
              <th>Telefono</th>
              <td>{jsonDisplay(usuario.telefono)}</td>
            </tr>
            <tr>
              <th>Correo electronico</th>
              <td>{jsonDisplay(usuario.correo_electronico)}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{usuario.estado}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(usuario.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{usuario.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(usuario.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{usuario.usuario_modificacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editUsuario({ id: usuario.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(usuario.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Usuario
