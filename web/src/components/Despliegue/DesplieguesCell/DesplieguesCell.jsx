import { Link, routes } from '@redwoodjs/router'

import Despliegues from 'src/components/Despliegue/Despliegues'

export const QUERY = gql`
  query FindDespliegues {
    despliegues {
      id
      id_componente
      id_servidor
      agrupador
      nombre
      tipo
      estado
      fecha_creacion
      servidores {
        id
        nombre
      }
      componentes {
        id
        nombre
        sistemas {
          id
          nombre
        }
      }
      usuario_roles {
        usuarios {
          nombre_usuario
        }
        roles {
          nombre
        }
      }
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
