import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Rol/RolsCell'
import { formatEnum, timeTag, truncate } from 'src/lib/formatters'

const DELETE_ROL_MUTATION = gql`
  mutation DeleteRolMutation($id: Int!) {
    deleteRol(id: $id) {
      id
    }
  }
`

const RolsList = ({ rols }) => {
  const [deleteRol] = useMutation(DELETE_ROL_MUTATION, {
    onCompleted: () => {
      toast.success('Rol deleted')
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
    if (confirm('Are you sure you want to delete rol ' + id + '?')) {
      deleteRol({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Fecha creacion</th>
            <th>Usuario creacion</th>
            <th>Fecha modificacion</th>
            <th>Usuario modificacion</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {rols.map((rol) => (
            <tr key={rol.id}>
              <td>{truncate(rol.id)}</td>
              <td>{truncate(rol.nombre)}</td>
              <td>{truncate(rol.tipo)}</td>
              <td>{formatEnum(rol.estado)}</td>
              <td>{timeTag(rol.fecha_creacion)}</td>
              <td>{truncate(rol.usuario_creacion)}</td>
              <td>{timeTag(rol.fecha_modificacion)}</td>
              <td>{truncate(rol.usuario_modificacion)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.rol({ id: rol.id })}
                    title={'Show rol ' + rol.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editRol({ id: rol.id })}
                    title={'Edit rol ' + rol.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete rol ' + rol.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(rol.id)}
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

export default RolsList
