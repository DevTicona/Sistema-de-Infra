import { Link, routes } from '@redwoodjs/router'

import Rols from 'src/components/Rol/Rols'

export const QUERY = gql`
  query FindRols {
    rols {
      id
      nombre
      tipo
      estado
      respaldo
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No rols yet.{' '}
      <Link to={routes.newRol()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ rols }) => {
  return <Rols rols={rols} />
}
