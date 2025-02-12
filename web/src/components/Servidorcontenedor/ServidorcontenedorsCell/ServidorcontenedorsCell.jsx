import { Link, routes } from '@redwoodjs/router'

import Servidorcontenedors from 'src/components/Servidorcontenedor/Servidorcontenedors'

export const QUERY = gql`
  query FindServidorcontenedors {
    servidorcontenedors {
      id
      id_servidor
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
      No servidorcontenedors yet.{' '}
      <Link to={routes.newServidorcontenedor()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ servidorcontenedors }) => {
  return <Servidorcontenedors servidorcontenedors={servidorcontenedors} />
}
