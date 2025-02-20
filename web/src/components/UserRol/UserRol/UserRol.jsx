import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import 'src/lib/formatters'

const DELETE_USER_ROL_MUTATION = gql`
  mutation DeleteUserRolMutation($id: Int!) {
    deleteUserRol(id: $id) {
      id
    }
  }
`

const UserRol = ({ userRol }) => {
  const [deleteUserRol] = useMutation(DELETE_USER_ROL_MUTATION, {
    onCompleted: () => {
      toast.success('UserRol deleted')
      navigate(routes.userRols())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete userRol ' + id + '?')) {
      deleteUserRol({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            UserRol {userRol.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{userRol.id}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{userRol.userId}</td>
            </tr>
            <tr>
              <th>Role id</th>
              <td>{userRol.roleId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editUserRol({ id: userRol.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(userRol.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default UserRol
