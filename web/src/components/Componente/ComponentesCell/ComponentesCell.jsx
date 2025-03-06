import { Link, routes } from '@redwoodjs/router'

import Componentes from 'src/components/Componente/Componentes'

export const QUERY = gql`
  query FindComponentes {
    componentes {
      id
      id_sistema
      nombre
      descripcion
      estado
      entorno
      categoria
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
      sistemas {
        id
        nombre
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No componentes yet.{' '}
      <Link to={routes.newComponente()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ componentes }) => {
  return <Componentes componentes={componentes} />
}
