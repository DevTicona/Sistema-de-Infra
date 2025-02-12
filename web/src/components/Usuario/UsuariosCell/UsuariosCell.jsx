import { Link, routes } from '@redwoodjs/router'

import Usuarios from 'src/components/Usuario/Usuarios'

export const QUERY = gql`
  query FindUsuarios {
    usuarios {
      id
      uuid_ciudadano
      nombre_usuario
      profile
      telefono
      correo_electronico
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
      No usuarios yet.{' '}
      <Link to={routes.newUsuario()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ usuarios }) => {
  return <Usuarios usuarios={usuarios} />
}
