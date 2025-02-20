import UserRol from 'src/components/UserRol/UserRol'

export const QUERY = gql`
  query FindUserRolById($id: Int!) {
    userRol: userRol(id: $id) {
      id
      userId
      roleId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>UserRol not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ userRol }) => {
  return <UserRol userRol={userRol} />
}
