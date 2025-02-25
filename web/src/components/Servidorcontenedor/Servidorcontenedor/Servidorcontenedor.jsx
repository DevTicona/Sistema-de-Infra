import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { jsonDisplay, timeTag } from 'src/lib/formatters'

const DELETE_SERVIDORCONTENEDOR_MUTATION = gql`
  mutation DeleteServidorcontenedorMutation($id: Int!) {
    deleteServidorcontenedor(id: $id) {
      id
    }
  }
`

const Servidorcontenedor = ({ servidorcontenedor }) => {
  const [deleteServidorcontenedor] = useMutation(
    DELETE_SERVIDORCONTENEDOR_MUTATION,
    {
      onCompleted: () => {
        toast.success('Servidorcontenedor deleted')
        navigate(routes.servidorcontenedors())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onDeleteClick = (id) => {
    if (
      confirm('Are you sure you want to delete servidorcontenedor ' + id + '?')
    ) {
      deleteServidorcontenedor({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Servidorcontenedor {servidorcontenedor.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{servidorcontenedor.id}</td>
            </tr>
            <tr>
              <th>Id servidor</th>
              <td>{servidorcontenedor.id_servidor}</td>
            </tr>
            <tr>
              <th>Id contenedor logico</th>
              <td>{servidorcontenedor.id_contenedor_logico}</td>
            </tr>
            <tr>
              <th>Sigla</th>
              <td>{servidorcontenedor.sigla}</td>
            </tr>
            <tr>
              <th>Nombre</th>
              <td>{servidorcontenedor.nombre}</td>
            </tr>
            <tr>
              <th>Descripcion</th>
              <td>{servidorcontenedor.descripcion}</td>
            </tr>
            <tr>
              <th>Tipo</th>
              <td>{servidorcontenedor.tipo}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{servidorcontenedor.estado}</td>
            </tr>
            <tr>
              <th>Respaldo</th>
              <td>{jsonDisplay(servidorcontenedor.respaldo)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(servidorcontenedor.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{servidorcontenedor.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(servidorcontenedor.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{servidorcontenedor.usuario_modificacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editServidorcontenedor({ id: servidorcontenedor.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(servidorcontenedor.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Servidorcontenedor
