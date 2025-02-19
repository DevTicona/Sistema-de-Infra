import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { QUERY } from 'src/components/Entidad/EntidadsCell'
import { formatEnum, timeTag, truncate } from 'src/lib/formatters'

const DELETE_ENTIDAD_MUTATION = gql`
  mutation DeleteEntidadMutation($id: Int!) {
    deleteEntidad(id: $id) {
      id
    }
  }
`

const EntidadsList = ({ entidads }) => {
  const { hasRole } = useAuth()
  const [deleteEntidad] = useMutation(DELETE_ENTIDAD_MUTATION, {
    onCompleted: () => {
      toast.success('Entidad deleted')
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
    if (confirm('Are you sure you want to delete entidad ' + id + '?')) {
      deleteEntidad({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Codigo</th>
            <th>Sigla</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Fecha creacion</th>
            <th>Usuario creacion</th>
            <th>Fecha modificacion</th>
            <th>Usuario modificacion</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {entidads.map((entidad) => (
            <tr key={entidad.id}>
              <td>{truncate(entidad.id)}</td>
              <td>{truncate(entidad.codigo)}</td>
              <td>{truncate(entidad.sigla)}</td>
              <td>{truncate(entidad.nombre)}</td>
              <td>{formatEnum(entidad.estado)}</td>
              <td>{timeTag(entidad.fecha_creacion)}</td>
              <td>{truncate(entidad.usuario_creacion)}</td>
              <td>{timeTag(entidad.fecha_modificacion)}</td>
              <td>{truncate(entidad.usuario_modificacion)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.entidad({ id: entidad.id })}
                    title={'Show entidad ' + entidad.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  {hasRole('admin') && (
                    <>
                      <Link
                        to={routes.editEntidad({ id: entidad.id })}
                        title={'Edit entidad ' + entidad.id}
                        className="rw-button rw-button-small rw-button-blue"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        title={'Delete entidad ' + entidad.id}
                        className="rw-button rw-button-small rw-button-red"
                        onClick={() => onDeleteClick(entidad.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EntidadsList
