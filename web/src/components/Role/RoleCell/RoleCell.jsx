import Role from 'src/components/Role/Role'

export const QUERY = gql`
  query FindRoleById($id: Int!) {
    role: role(id: $id) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Role not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ role }) => {
  return <Role role={role} />
}
