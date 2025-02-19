import { Link, routes } from '@redwoodjs/router'

import Entidads from 'src/components/Entidad/Entidads'

export const QUERY = gql`
  query FindEntidads {
    entidads {
      id
      codigo
      sigla
      nombre
      estado
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
      No entidads yet.{' '}
      <Link to={routes.newEntidad()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ entidads }) => {
  return <Entidads entidads={entidads} />
}
