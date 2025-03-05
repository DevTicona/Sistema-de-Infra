import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Despliegue/DesplieguesCell'
import { formatEnum, timeTag, truncate } from 'src/lib/formatters'

const DELETE_DESPLIEGUE_MUTATION = gql`
  mutation DeleteDespliegueMutation($id: Int!) {
    deleteDespliegue(id: $id) {
      id
    }
  }
`

const DesplieguesList = ({ despliegues }) => {
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

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Agrupador</th>
            <th>Descripcion</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Fecha creacion</th>
            <th>Servidor</th>
            <th>sistema</th>
            <th>componente</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {despliegues.map((despliegue) => (
            <tr key={despliegue.id}>
              <td>{truncate(despliegue.id)}</td>
              <td>{truncate(despliegue.agrupador)}</td>
              <td>{truncate(despliegue.descripcion)}</td>
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
                {despliegue.componentes &&
                despliegue.componentes.sistemas &&
                despliegue.componentes.sistemas.id ? (
                  <Link
                    to={routes.sistema({
                      id: despliegue.componentes.sistemas.id,
                    })}
                  >
                    {truncate(despliegue.componentes.sistemas.nombre)}
                  </Link>
                ) : (
                  'No sistema'
                )}
              </td>
              <td>
                {despliegue.componentes
                  ? truncate(despliegue.componentes.nombre)
                  : 'No componente'}
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
