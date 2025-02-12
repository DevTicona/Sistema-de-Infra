import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Sistema/SistemasCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

const DELETE_SISTEMA_MUTATION = gql`
  mutation DeleteSistemaMutation($id: Int!) {
    deleteSistema(id: $id) {
      id
    }
  }
`

const SistemasList = ({ sistemas }) => {
  const [deleteSistema] = useMutation(DELETE_SISTEMA_MUTATION, {
    onCompleted: () => {
      toast.success('Sistema deleted')
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
    if (confirm('Are you sure you want to delete sistema ' + id + '?')) {
      deleteSistema({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Id padre</th>
            <th>Id entidad</th>
            <th>Codigo</th>
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
          {sistemas.map((sistema) => (
            <tr key={sistema.id}>
              <td>{truncate(sistema.id)}</td>
              <td>{truncate(sistema.id_padre)}</td>
              <td>{truncate(sistema.id_entidad)}</td>
              <td>{truncate(sistema.codigo)}</td>
              <td>{truncate(sistema.sigla)}</td>
              <td>{truncate(sistema.nombre)}</td>
              <td>{truncate(sistema.descripcion)}</td>
              <td>{truncate(sistema.tipo)}</td>
              <td>{truncate(sistema.estado)}</td>
              <td>{jsonTruncate(sistema.respaldo)}</td>
              <td>{timeTag(sistema.fecha_creacion)}</td>
              <td>{truncate(sistema.usuario_creacion)}</td>
              <td>{timeTag(sistema.fecha_modificacion)}</td>
              <td>{truncate(sistema.usuario_modificacion)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.sistema({ id: sistema.id })}
                    title={'Show sistema ' + sistema.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editSistema({ id: sistema.id })}
                    title={'Edit sistema ' + sistema.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete sistema ' + sistema.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(sistema.id)}
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

export default SistemasList
