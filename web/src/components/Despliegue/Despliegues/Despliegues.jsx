import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Despliegue/DesplieguesCell'
import { useSearch } from 'src/context/SearchContext'
import { formatEnum, timeTag, truncate } from 'src/lib/formatters'
const DELETE_DESPLIEGUE_MUTATION = gql`
  mutation DeleteDespliegueMutation($id: Int!) {
    deleteDespliegue(id: $id) {
      id
    }
  }
`

const DesplieguesList = ({ despliegues }) => {
  const { search } = useSearch() // Obtén el valor de búsqueda desde el contexto

  const [deleteDespliegue] = useMutation(DELETE_DESPLIEGUE_MUTATION, {
    onCompleted: () => {
      toast.success('Despliegue deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete despliegue ' + id + '?')) {
      deleteDespliegue({ variables: { id } })
    }
  }

  const filteredDespliegues = despliegues.filter(
    (despliegue) =>
      // Filtra por "nombre", "nodo", "ip" y "tipo"
      despliegue.agrupador
        ?.toLowerCase()
        .includes(search?.toLowerCase() || '') ||
      despliegue.tipo?.toLowerCase().includes(search?.toLowerCase() || '') ||
      despliegue.componentes.nombre
        ?.toLowerCase()
        .includes(search?.toLowerCase() || '') ||
      despliegue.servidores.nombre
        ?.toLowerCase()
        .includes(search?.toLowerCase() || '')
  )
  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Agrupador</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Fecha creacion</th>
            <th>Servidor</th>
            <th>Componente</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {filteredDespliegues.map((despliegue) => (
            <tr key={despliegue.id}>
              <td>{truncate(despliegue.id)}</td>
              <td>{truncate(despliegue.agrupador)}</td>
              <td>{truncate(despliegue.nombre)}</td>
              <td>{truncate(despliegue.tipo)}</td>
              <td>{formatEnum(despliegue.estado)}</td>
              <td>{timeTag(despliegue.fecha_creacion)}</td>
              <td>
                {despliegue.servidores && despliegue.servidores.id ? (
                  <Link to={routes.servidor({ id: despliegue.servidores.id })}>
                    {truncate(despliegue.servidores.nombre)}
                  </Link>
                ) : (
                  'No servidor'
                )}
              </td>
              <td>
                {despliegue.componentes ? (
                  <Link
                    to={routes.sistema({
                      id: despliegue.componentes.id,
                    })}
                  >
                    {truncate(despliegue.componentes.nombre)}
                  </Link>
                ) : (
                  'No componente'
                )}
              </td>
              <td>
                {despliegue.usuario_roles.usuarios
                  ? truncate(despliegue.usuario_roles.usuarios.nombre_usuario)
                  : 'No usuario'}
              </td>
              <td>
                {despliegue.usuario_roles.usuarios
                  ? truncate(despliegue.usuario_roles.roles.nombre)
                  : 'No Rol'}
              </td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.despliegue({ id: despliegue.id })}
                    title={'Show despliegue ' + despliegue.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editDespliegue({ id: despliegue.id })}
                    title={'Edit despliegue ' + despliegue.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete despliegue ' + despliegue.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(despliegue.id)}
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

export default DesplieguesList
