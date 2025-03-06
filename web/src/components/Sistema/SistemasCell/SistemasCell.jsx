import { Link, routes } from '@redwoodjs/router'

import Sistemas from 'src/components/Sistema/Sistemas'

export const QUERY = gql`
  query FindSistemas {
    sistemas {
      id
      id_padre
      id_entidad
      codigo
      sigla
      nombre
      descripcion
      estado
      respaldo_creacion
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
      entidades {
        id
        nombre
      }
      usuario_roles {
        usuarios {
          id
          nombre_usuario
        }
        roles {
          id
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
      No sistemas yet.{' '}
      <Link to={routes.newSistema()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ sistemas }) => {
  return <Sistemas sistemas={sistemas} />
}
