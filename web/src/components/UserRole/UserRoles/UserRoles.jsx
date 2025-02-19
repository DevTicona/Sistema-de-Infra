import { Link, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { truncate } from 'src/lib/formatters'

// Definir la query para obtener los userRoles
const USER_ROLES_QUERY = gql`
  query FindUserRoles {
    userRoles {
      id
      user {
        id
        nombre
        email
        userRoles {
          role {
            name
          }
        }
      }
      role {
        name
      }
    }
  }
`

const DELETE_USER_ROLE_MUTATION = gql`
  mutation DeleteUserRoleMutation($id: Int!) {
    deleteUserRole(id: $id) {
      id
    }
  }
`

const UserRolesList = () => {
  const { data, loading, error } = useQuery(USER_ROLES_QUERY) // Usamos useQuery para obtener los userRoles

  const [deleteUserRole] = useMutation(DELETE_USER_ROLE_MUTATION, {
    onCompleted: () => {
      toast.success('UserRole deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: USER_ROLES_QUERY }], // Refetch de la query para actualizar la lista
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete userRole ' + id + '?')) {
      deleteUserRole({ variables: { id } })
    }
  }

  if (loading) return <div>Loading...</div> // Cargar un mensaje mientras se obtienen los datos
  if (error) return <div>Error: {error.message}</div> // Manejar errores

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Roles</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {data.userRoles.map((userRole) => (
            <tr key={userRole.id}>
              <td>{truncate(userRole.user.id)}</td>
              <td>{truncate(userRole.user.nombre)}</td>
              <td>{truncate(userRole.user.email)}</td>
              <td>
                {userRole.user.userRoles.map((ur) => ur.role.name).join(', ')}
              </td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.userRole({ id: userRole.id })}
                    title={'Show userRole ' + userRole.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editUserRole({ id: userRole.id })}
                    title={'Edit userRole ' + userRole.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete userRole ' + userRole.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(userRole.id)}
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

export default UserRolesList
