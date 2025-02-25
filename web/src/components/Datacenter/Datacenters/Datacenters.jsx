import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Datacenter/DatacentersCell'
import { formatEnum, timeTag, truncate } from 'src/lib/formatters'

const DELETE_DATACENTER_MUTATION = gql`
  mutation DeleteDatacenterMutation($id: Int!) {
    deleteDatacenter(id: $id) {
      id
    }
  }
`

const DatacentersList = ({ datacenters }) => {
  const [deleteDatacenter] = useMutation(DELETE_DATACENTER_MUTATION, {
    onCompleted: () => {
      toast.success('Datacenter deleted')
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
    if (confirm('Are you sure you want to delete datacenter ' + id + '?')) {
      deleteDatacenter({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Ubicacion</th>
            <th>Capacidad</th>
            <th>Estado</th>
            <th>Fecha creacion</th>
            <th>Usuario creacion</th>
            <th>Fecha modificacion</th>
            <th>Usuario modificacion</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {datacenters.map((datacenter) => (
            <tr key={datacenter.id}>
              <td>{truncate(datacenter.id)}</td>
              <td>{truncate(datacenter.nombre)}</td>
              <td>{truncate(datacenter.ubicacion)}</td>
              <td>{truncate(datacenter.capacidad)}</td>
              <td>{formatEnum(datacenter.estado)}</td>
              <td>{timeTag(datacenter.fecha_creacion)}</td>
              <td>{truncate(datacenter.usuario_creacion)}</td>
              <td>{timeTag(datacenter.fecha_modificacion)}</td>
              <td>{truncate(datacenter.usuario_modificacion)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.datacenter({ id: datacenter.id })}
                    title={'Show datacenter ' + datacenter.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editDatacenter({ id: datacenter.id })}
                    title={'Edit datacenter ' + datacenter.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete datacenter ' + datacenter.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(datacenter.id)}
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

export default DatacentersList
