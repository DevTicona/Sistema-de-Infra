import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { formatEnum, jsonDisplay, timeTag, truncate } from 'src/lib/formatters'

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
          <thead>
            <tr>
              <th>Id</th>
              <th>Nro cluster</th>
              <th>Vmid</th>
              <th>Nombre</th>
              <th>Nodo</th>
              <th>Ip</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Metadata</th>
              <th>Fecha creacion</th>
              <th>Usuario creacion</th>
              <th>Fecha modificacion</th>
              <th>Usuario modificacion</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{servidor.id}</td>
              <td>{servidor.nro_cluster}</td>
              <td>{servidor.vmid}</td>
              <td>{servidor.nombre}</td>
              <td>{servidor.nodo}</td>
              <td>{servidor.ip}</td>
              <td>{servidor.tipo}</td>
              <td>{formatEnum(servidor.estado)}</td>
              <td>{jsonDisplay(servidor.metadata)}</td>
              <td>{timeTag(servidor.fecha_creacion)}</td>
              <td>{servidor.usuario_creacion}</td>
              <td>{timeTag(servidor.fecha_modificacion)}</td>
              <td>{servidor.usuario_modificacion}</td>
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
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Servidor {servidor.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <thead>
            <tr>
              <th>Data Center</th>
              <th>Despliegue Asociado</th>
              <th>Componente Asociado</th>
              <th>Sistema Asociado</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{servidor.data_centers?.nombre || 'N/A'}</td>
              <td>
                {' '}
                {servidor.despliegue
                  ? truncate(servidor.despliegue.agrupador)
                  : 'No despliegue'}
              </td>
              <td>{servidor.despliegue?.componentes?.nombre || 'N/A'}</td>
              <td>
                {servidor.despliegue?.componentes?.sistemas?.nombre || 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Servidor
