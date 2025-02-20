import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { formatEnum, timeTag } from 'src/lib/formatters'

const DELETE_ROL_MUTATION = gql`
  mutation DeleteRolMutation($id: Int!) {
    deleteRol(id: $id) {
      id
    }
  }
`

const Rol = ({ rol }) => {
  const [deleteRol] = useMutation(DELETE_ROL_MUTATION, {
    onCompleted: () => {
      toast.success('Rol deleted')
      navigate(routes.rols())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete rol ' + id + '?')) {
      deleteRol({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Rol {rol.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{rol.id}</td>
            </tr>
            <tr>
              <th>Nombre</th>
              <td>{rol.nombre}</td>
            </tr>
            <tr>
              <th>Tipo</th>
              <td>{rol.tipo}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{formatEnum(rol.estado)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(rol.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{rol.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(rol.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{rol.usuario_modificacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editRol({ id: rol.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(rol.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Rol
