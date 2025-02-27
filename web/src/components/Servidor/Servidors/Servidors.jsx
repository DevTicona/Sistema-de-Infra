import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Servidor/ServidorsCell'
import { formatEnum, jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

const DELETE_SERVIDOR_MUTATION = gql`
  mutation DeleteServidorMutation($id: Int!) {
    deleteServidor(id: $id) {
      id
    }
  }
`

const ServidorsList = ({ servidors }) => {
  const [deleteServidor] = useMutation(DELETE_SERVIDOR_MUTATION, {
    onCompleted: () => {
      toast.success('Servidor deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete servidor ' + id + '?')) {
      deleteServidor({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
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
            <th>Id data center</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {servidors.map((servidor) => (
            <tr key={servidor.id}>
              <td>{truncate(servidor.id)}</td>
              <td>{truncate(servidor.nro_cluster)}</td>
              <td>{truncate(servidor.vmid)}</td>
              <td>{truncate(servidor.nombre)}</td>
              <td>{truncate(servidor.nodo)}</td>
              <td>{truncate(servidor.ip)}</td>
              <td>{truncate(servidor.tipo)}</td>
              <td>{formatEnum(servidor.estado)}</td>
              <td>{jsonTruncate(servidor.metadata)}</td>
              <td>{timeTag(servidor.fecha_creacion)}</td>
              <td>{truncate(servidor.usuario_creacion)}</td>
              <td>{timeTag(servidor.fecha_modificacion)}</td>
              <td>{truncate(servidor.usuario_modificacion)}</td>
              <td>{truncate(servidor.id_data_center)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.servidor({ id: servidor.id })}
                    title={'Show servidor ' + servidor.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editServidor({ id: servidor.id })}
                    title={'Edit servidor ' + servidor.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete servidor ' + servidor.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(servidor.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ServidorsList
