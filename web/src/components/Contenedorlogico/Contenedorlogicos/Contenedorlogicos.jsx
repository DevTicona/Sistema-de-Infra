import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Contenedorlogico/ContenedorlogicosCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

const DELETE_CONTENEDORLOGICO_MUTATION = gql`
  mutation DeleteContenedorlogicoMutation($id: Int!) {
    deleteContenedorlogico(id: $id) {
      id
    }
  }
`

const ContenedorlogicosList = ({ contenedorlogicos }) => {
  const [deleteContenedorlogico] = useMutation(
    DELETE_CONTENEDORLOGICO_MUTATION,
    {
      onCompleted: () => {
        toast.success('Contenedorlogico deleted')
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
      confirm('Are you sure you want to delete contenedorlogico ' + id + '?')
    ) {
      deleteContenedorlogico({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Id padre</th>
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
          {contenedorlogicos.map((contenedorlogico) => (
            <tr key={contenedorlogico.id}>
              <td>{truncate(contenedorlogico.id)}</td>
              <td>{truncate(contenedorlogico.id_padre)}</td>
              <td>{truncate(contenedorlogico.codigo)}</td>
              <td>{truncate(contenedorlogico.sigla)}</td>
              <td>{truncate(contenedorlogico.nombre)}</td>
              <td>{truncate(contenedorlogico.descripcion)}</td>
              <td>{truncate(contenedorlogico.tipo)}</td>
              <td>{truncate(contenedorlogico.estado)}</td>
              <td>{jsonTruncate(contenedorlogico.respaldo)}</td>
              <td>{timeTag(contenedorlogico.fecha_creacion)}</td>
              <td>{truncate(contenedorlogico.usuario_creacion)}</td>
              <td>{timeTag(contenedorlogico.fecha_modificacion)}</td>
              <td>{truncate(contenedorlogico.usuario_modificacion)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.contenedorlogico({ id: contenedorlogico.id })}
                    title={
                      'Show contenedorlogico ' + contenedorlogico.id + ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editContenedorlogico({
                      id: contenedorlogico.id,
                    })}
                    title={'Edit contenedorlogico ' + contenedorlogico.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete contenedorlogico ' + contenedorlogico.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(contenedorlogico.id)}
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

export default ContenedorlogicosList
