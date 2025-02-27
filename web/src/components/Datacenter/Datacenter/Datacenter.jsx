import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { formatEnum, timeTag } from 'src/lib/formatters'

const DELETE_DATACENTER_MUTATION = gql`
  mutation DeleteDatacenterMutation($id: Int!) {
    deleteDatacenter(id: $id) {
      id
    }
  }
`

const Datacenter = ({ datacenter }) => {
  const [deleteDatacenter] = useMutation(DELETE_DATACENTER_MUTATION, {
    onCompleted: () => {
      toast.success('Datacenter deleted')
      navigate(routes.datacenters())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete datacenter ' + id + '?')) {
      deleteDatacenter({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Datacenter {datacenter.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{datacenter.id}</td>
            </tr>
            <tr>
              <th>Nombre</th>
              <td>{datacenter.nombre}</td>
            </tr>
            <tr>
              <th>Ubicacion</th>
              <td>{datacenter.ubicacion}</td>
            </tr>
            <tr>
              <th>Capacidad</th>
              <td>{datacenter.capacidad}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{formatEnum(datacenter.estado)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(datacenter.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{datacenter.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(datacenter.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{datacenter.usuario_modificacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editDatacenter({ id: datacenter.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(datacenter.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Datacenter
