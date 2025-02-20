import { Link, routes } from '@redwoodjs/router'

import UserRols from 'src/components/UserRol/UserRols'

export const QUERY = gql`
  query FindUserRols {
    userRols {
      id
      userId
      roleId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No userRols yet.{' '}
      <Link to={routes.newUserRol()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ userRols }) => {
  return <UserRols userRols={userRols} />
}
