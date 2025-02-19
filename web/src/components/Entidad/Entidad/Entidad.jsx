import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { formatEnum, timeTag } from 'src/lib/formatters'

const DELETE_ENTIDAD_MUTATION = gql`
  mutation DeleteEntidadMutation($id: Int!) {
    deleteEntidad(id: $id) {
      id
    }
  }
`

const Entidad = ({ entidad }) => {
  const [deleteEntidad] = useMutation(DELETE_ENTIDAD_MUTATION, {
    onCompleted: () => {
      toast.success('Entidad deleted')
      navigate(routes.entidads())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete entidad ' + id + '?')) {
      deleteEntidad({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Entidad {entidad.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{entidad.id}</td>
            </tr>
            <tr>
              <th>Codigo</th>
              <td>{entidad.codigo}</td>
            </tr>
            <tr>
              <th>Sigla</th>
              <td>{entidad.sigla}</td>
            </tr>
            <tr>
              <th>Nombre</th>
              <td>{entidad.nombre}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{formatEnum(entidad.estado)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(entidad.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{entidad.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(entidad.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{entidad.usuario_modificacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editEntidad({ id: entidad.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(entidad.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Entidad
