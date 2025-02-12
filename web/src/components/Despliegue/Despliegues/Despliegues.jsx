import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Despliegue/DesplieguesCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

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
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
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
            <th>Id componente</th>
            <th>Id contenedor logico</th>
            <th>Sigla</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Respaldo</th>
            <th>Fecha creacion</th>
            <th>Usuario creacion</th>
            <th>Fecha modificacion</th>
            <th>Usuario modificacion</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {despliegues.map((despliegue) => (
            <tr key={despliegue.id}>
              <td>{truncate(despliegue.id)}</td>
              <td>{truncate(despliegue.id_componente)}</td>
              <td>{truncate(despliegue.id_contenedor_logico)}</td>
              <td>{truncate(despliegue.sigla)}</td>
              <td>{truncate(despliegue.nombre)}</td>
              <td>{truncate(despliegue.descripcion)}</td>
              <td>{truncate(despliegue.tipo)}</td>
              <td>{truncate(despliegue.estado)}</td>
              <td>{jsonTruncate(despliegue.respaldo)}</td>
              <td>{timeTag(despliegue.fecha_creacion)}</td>
              <td>{truncate(despliegue.usuario_creacion)}</td>
              <td>{timeTag(despliegue.fecha_modificacion)}</td>
              <td>{truncate(despliegue.usuario_modificacion)}</td>
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
