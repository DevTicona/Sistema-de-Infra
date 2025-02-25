import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Usuariorol/UsuariorolsCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

const DELETE_USUARIOROL_MUTATION = gql`
  mutation DeleteUsuariorolMutation($id: Int!) {
    deleteUsuariorol(id: $id) {
      id
    }
  }
`

const UsuariorolsList = ({ usuariorols }) => {
  const [deleteUsuariorol] = useMutation(DELETE_USUARIOROL_MUTATION, {
    onCompleted: () => {
      toast.success('Usuariorol deleted')
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
    if (confirm('Are you sure you want to delete usuariorol ' + id + '?')) {
      deleteUsuariorol({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Id usuario</th>
            <th>Id rol</th>
            <th>Id contenedor logico</th>
            <th>Id sistema</th>
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
          {usuariorols.map((usuariorol) => (
            <tr key={usuariorol.id}>
              <td>{truncate(usuariorol.id)}</td>
              <td>{truncate(usuariorol.id_usuario)}</td>
              <td>{truncate(usuariorol.id_rol)}</td>
              <td>{truncate(usuariorol.id_contenedor_logico)}</td>
              <td>{truncate(usuariorol.id_sistema)}</td>
              <td>{truncate(usuariorol.descripcion)}</td>
              <td>{truncate(usuariorol.tipo)}</td>
              <td>{truncate(usuariorol.estado)}</td>
              <td>{jsonTruncate(usuariorol.respaldo)}</td>
              <td>{timeTag(usuariorol.fecha_creacion)}</td>
              <td>{truncate(usuariorol.usuario_creacion)}</td>
              <td>{timeTag(usuariorol.fecha_modificacion)}</td>
              <td>{truncate(usuariorol.usuario_modificacion)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.usuariorol({ id: usuariorol.id })}
                    title={'Show usuariorol ' + usuariorol.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editUsuariorol({ id: usuariorol.id })}
                    title={'Edit usuariorol ' + usuariorol.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete usuariorol ' + usuariorol.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(usuariorol.id)}
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

export default UsuariorolsList
