import { Link, routes } from '@redwoodjs/router'

import Usuariorols from 'src/components/Usuariorol/Usuariorols'

export const QUERY = gql`
  query FindUsuariorols {
    usuariorols {
      id
      id_usuario
      id_rol
      id_despliegue
      id_sistema
      estado
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
      sistemas {
        id
        nombre
      }
      usuarios {
        id
        nombre_usuario
      }
      roles {
        id
        nombre
      }
      despliegue {
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
      No usuariorols yet.{' '}
      <Link to={routes.newUsuariorol()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ usuariorols }) => {
  return <Usuariorols usuariorols={usuariorols} />
}
