import { Link, routes } from '@redwoodjs/router'

import Despliegues from 'src/components/Despliegue/Despliegues'

export const QUERY = gql`
  query FindDespliegues {
    despliegues {
      id
      id_componente
      id_contenedor_logico
      sigla
      nombre
      descripcion
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
      No despliegues yet.{' '}
      <Link to={routes.newDespliegue()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ despliegues }) => {
  return <Despliegues despliegues={despliegues} />
}
