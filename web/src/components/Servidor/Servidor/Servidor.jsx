import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { jsonDisplay, timeTag } from 'src/lib/formatters'

const DELETE_SERVIDOR_MUTATION = gql`
  mutation DeleteServidorMutation($id: Int!) {
    deleteServidor(id: $id) {
      id
    }
  }
`

const Servidor = ({ servidor }) => {
  const [deleteServidor] = useMutation(DELETE_SERVIDOR_MUTATION, {
    onCompleted: () => {
      toast.success('Servidor deleted')
      navigate(routes.servidors())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete servidor ' + id + '?')) {
      deleteServidor({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Servidor {servidor.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{servidor.id}</td>
            </tr>
            <tr>
              <th>Nro cluster</th>
              <td>{servidor.nro_cluster}</td>
            </tr>
            <tr>
              <th>Vmid</th>
              <td>{servidor.vmid}</td>
            </tr>
            <tr>
              <th>Nombre</th>
              <td>{servidor.nombre}</td>
            </tr>
            <tr>
              <th>Nodo</th>
              <td>{servidor.nodo}</td>
            </tr>
            <tr>
              <th>Ip</th>
              <td>{servidor.ip}</td>
            </tr>
            <tr>
              <th>Tipo</th>
              <td>{servidor.tipo}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{servidor.estado}</td>
            </tr>
            <tr>
              <th>Metadata</th>
              <td>{jsonDisplay(servidor.metadata)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(servidor.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{servidor.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(servidor.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{servidor.usuario_modificacion}</td>
            </tr>
            <tr>
              <th>Id cuchilla</th>
              <td>{servidor.id_cuchilla}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editServidor({ id: servidor.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(servidor.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Servidor
