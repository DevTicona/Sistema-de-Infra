import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { formatEnum, timeTag } from 'src/lib/formatters'

const DELETE_USUARIOROL_MUTATION = gql`
  mutation DeleteUsuariorolMutation($id: Int!) {
    deleteUsuariorol(id: $id) {
      id
    }
  }
`

const Usuariorol = ({ usuariorol }) => {
  const [deleteUsuariorol] = useMutation(DELETE_USUARIOROL_MUTATION, {
    onCompleted: () => {
      toast.success('Usuariorol deleted')
      navigate(routes.usuariorols())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete usuariorol ' + id + '?')) {
      deleteUsuariorol({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Usuariorol {usuariorol.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{usuariorol.id}</td>
            </tr>
            <tr>
              <th>Id usuario</th>
              <td>{usuariorol.id_usuario}</td>
            </tr>
            <tr>
              <th>Id rol</th>
              <td>{usuariorol.id_rol}</td>
            </tr>
            <tr>
              <th>Id despliegue</th>
              <td>{usuariorol.id_despliegue}</td>
            </tr>
            <tr>
              <th>Id sistema</th>
              <td>{usuariorol.id_sistema}</td>
            </tr>

            <tr>
              <th>Estado</th>
              <td>{formatEnum(usuariorol.estado)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(usuariorol.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{usuariorol.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(usuariorol.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{usuariorol.usuario_modificacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editUsuariorol({ id: usuariorol.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(usuariorol.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Usuariorol
