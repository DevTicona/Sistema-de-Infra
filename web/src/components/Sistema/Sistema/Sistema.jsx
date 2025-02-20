import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { jsonDisplay, timeTag } from 'src/lib/formatters'

const DELETE_SISTEMA_MUTATION = gql`
  mutation DeleteSistemaMutation($id: Int!) {
    deleteSistema(id: $id) {
      id
    }
  }
`

const Sistema = ({ sistema }) => {
  const [deleteSistema] = useMutation(DELETE_SISTEMA_MUTATION, {
    onCompleted: () => {
      toast.success('Sistema deleted')
      navigate(routes.sistemas())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete sistema ' + id + '?')) {
      deleteSistema({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Sistema {sistema.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{sistema.id}</td>
            </tr>
            <tr>
              <th>Id padre</th>
              <td>{sistema.id_padre}</td>
            </tr>
            <tr>
              <th>Id entidad</th>
              <td>{sistema.id_entidad}</td>
            </tr>
            <tr>
              <th>Codigo</th>
              <td>{sistema.codigo}</td>
            </tr>
            <tr>
              <th>Sigla</th>
              <td>{sistema.sigla}</td>
            </tr>
            <tr>
              <th>Nombre</th>
              <td>{sistema.nombre}</td>
            </tr>
            <tr>
              <th>Descripcion</th>
              <td>{sistema.descripcion}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{sistema.estado}</td>
            </tr>
            <tr>
              <th>Respaldo</th>
              <td>{jsonDisplay(sistema.respaldo_creacion)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(sistema.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{sistema.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(sistema.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{sistema.usuario_modificacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editSistema({ id: sistema.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(sistema.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Sistema
