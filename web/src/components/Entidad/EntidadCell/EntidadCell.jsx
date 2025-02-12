import Entidad from 'src/components/Entidad/Entidad'

export const QUERY = gql`
  query FindEntidadById($id: Int!) {
    entidad: entidad(id: $id) {
      id
      codigo
      sigla
      nombre
      tipo
      estado
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Entidad not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ entidad }) => {
  return <Entidad entidad={entidad} />
}
