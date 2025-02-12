import Componente from 'src/components/Componente/Componente'

export const QUERY = gql`
  query FindComponenteById($id: Int!) {
    componente: componente(id: $id) {
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
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Componente not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ componente }) => {
  return <Componente componente={componente} />
}
