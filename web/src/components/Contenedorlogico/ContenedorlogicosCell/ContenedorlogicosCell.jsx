import { Link, routes } from '@redwoodjs/router'

import Contenedorlogicos from 'src/components/Contenedorlogico/Contenedorlogicos'

export const QUERY = gql`
  query FindContenedorlogicos {
    contenedorlogicos {
      id
      id_padre
      codigo
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
      No contenedorlogicos yet.{' '}
      <Link to={routes.newContenedorlogico()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ contenedorlogicos }) => {
  return <Contenedorlogicos contenedorlogicos={contenedorlogicos} />
}
