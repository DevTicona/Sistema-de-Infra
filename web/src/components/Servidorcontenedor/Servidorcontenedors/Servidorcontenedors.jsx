import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Servidorcontenedor/ServidorcontenedorsCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

const DELETE_SERVIDORCONTENEDOR_MUTATION = gql`
  mutation DeleteServidorcontenedorMutation($id: Int!) {
    deleteServidorcontenedor(id: $id) {
      id
    }
  }
`

const ServidorcontenedorsList = ({ servidorcontenedors }) => {
  const [deleteServidorcontenedor] = useMutation(
    DELETE_SERVIDORCONTENEDOR_MUTATION,
    {
      onCompleted: () => {
        toast.success('Servidorcontenedor deleted')
      },
      onError: (error) => {
        toast.error(error.message)
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
    }
  )

  const onDeleteClick = (id) => {
    if (
      confirm('Are you sure you want to delete servidorcontenedor ' + id + '?')
    ) {
      deleteServidorcontenedor({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Id servidor</th>
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
          {servidorcontenedors.map((servidorcontenedor) => (
            <tr key={servidorcontenedor.id}>
              <td>{truncate(servidorcontenedor.id)}</td>
              <td>{truncate(servidorcontenedor.id_servidor)}</td>
              <td>{truncate(servidorcontenedor.id_contenedor_logico)}</td>
              <td>{truncate(servidorcontenedor.sigla)}</td>
              <td>{truncate(servidorcontenedor.nombre)}</td>
              <td>{truncate(servidorcontenedor.descripcion)}</td>
              <td>{truncate(servidorcontenedor.tipo)}</td>
              <td>{truncate(servidorcontenedor.estado)}</td>
              <td>{jsonTruncate(servidorcontenedor.respaldo)}</td>
              <td>{timeTag(servidorcontenedor.fecha_creacion)}</td>
              <td>{truncate(servidorcontenedor.usuario_creacion)}</td>
              <td>{timeTag(servidorcontenedor.fecha_modificacion)}</td>
              <td>{truncate(servidorcontenedor.usuario_modificacion)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.servidorcontenedor({
                      id: servidorcontenedor.id,
                    })}
                    title={
                      'Show servidorcontenedor ' +
                      servidorcontenedor.id +
                      ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editServidorcontenedor({
                      id: servidorcontenedor.id,
                    })}
                    title={'Edit servidorcontenedor ' + servidorcontenedor.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete servidorcontenedor ' + servidorcontenedor.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(servidorcontenedor.id)}
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

export default ServidorcontenedorsList
