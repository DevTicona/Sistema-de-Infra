import { Link, routes } from '@redwoodjs/router'

import Datacenters from 'src/components/Datacenter/Datacenters'

export const QUERY = gql`
  query FindDatacenters {
    datacenters {
      id
      nombre
      ubicacion
      capacidad
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
      No datacenters yet.{' '}
      <Link to={routes.newDatacenter()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ datacenters }) => {
  return <Datacenters datacenters={datacenters} />
}
