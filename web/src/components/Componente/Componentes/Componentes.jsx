import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Componente/ComponentesCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_COMPONENTE_MUTATION = gql`
  mutation DeleteComponenteMutation($id: Int!) {
    deleteComponente(id: $id) {
      id
    }
  }
`

const ComponentesList = ({ componentes }) => {
  const [deleteComponente] = useMutation(DELETE_COMPONENTE_MUTATION, {
    onCompleted: () => {
      toast.success('Componente deleted')
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
    if (confirm('Are you sure you want to delete componente ' + id + '?')) {
      deleteComponente({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Id sistema</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Estado</th>
            <th>Entorno</th>
            <th>Categoria</th>
            <th>Fecha creacion</th>
            <th>Usuario creacion</th>
            <th>Fecha modificacion</th>
            <th>Usuario modificacion</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {componentes.map((componente) => (
            <tr key={componente.id}>
              <td>{truncate(componente.id)}</td>
              <td>{truncate(componente.id_sistema)}</td>
              <td>{truncate(componente.nombre)}</td>
              <td>{truncate(componente.descripcion)}</td>
              <td>{truncate(componente.estado)}</td>
              <td>{truncate(componente.entorno)}</td>
              <td>{truncate(componente.categoria)}</td>
              <td>{timeTag(componente.fecha_creacion)}</td>
              <td>{truncate(componente.usuario_creacion)}</td>
              <td>{timeTag(componente.fecha_modificacion)}</td>
              <td>{truncate(componente.usuario_modificacion)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.componente({ id: componente.id })}
                    title={'Show componente ' + componente.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editComponente({ id: componente.id })}
                    title={'Edit componente ' + componente.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete componente ' + componente.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(componente.id)}
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

export default ComponentesList
