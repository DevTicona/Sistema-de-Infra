import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Usuario/UsuariosCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

const DELETE_USUARIO_MUTATION = gql`
  mutation DeleteUsuarioMutation($id: Int!) {
    deleteUsuario(id: $id) {
      id
    }
  }
`

const UsuariosList = ({ usuarios }) => {
  const [deleteUsuario] = useMutation(DELETE_USUARIO_MUTATION, {
    onCompleted: () => {
      toast.success('Usuario deleted')
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
    if (confirm('Are you sure you want to delete usuario ' + id + '?')) {
      deleteUsuario({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Uuid ciudadano</th>
            <th>Nombre usuario</th>
            <th>Profile</th>
            <th>Telefono</th>
            <th>Correo electronico</th>
            <th>Estado</th>
            <th>Fecha creacion</th>
            <th>Usuario creacion</th>
            <th>Fecha modificacion</th>
            <th>Usuario modificacion</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{truncate(usuario.id)}</td>
              <td>{truncate(usuario.uuid_ciudadano)}</td>
              <td>{truncate(usuario.nombre_usuario)}</td>
              <td>{jsonTruncate(usuario.profile)}</td>
              <td>{jsonTruncate(usuario.telefono)}</td>
              <td>{jsonTruncate(usuario.correo_electronico)}</td>
              <td>{truncate(usuario.estado)}</td>
              <td>{timeTag(usuario.fecha_creacion)}</td>
              <td>{truncate(usuario.usuario_creacion)}</td>
              <td>{timeTag(usuario.fecha_modificacion)}</td>
              <td>{truncate(usuario.usuario_modificacion)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.usuario({ id: usuario.id })}
                    title={'Show usuario ' + usuario.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editUsuario({ id: usuario.id })}
                    title={'Edit usuario ' + usuario.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete usuario ' + usuario.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(usuario.id)}
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

export default UsuariosList
