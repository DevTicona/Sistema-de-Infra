import Sistema from 'src/components/Sistema/Sistema'

export const QUERY = gql`
  query FindSistemaById($id: Int!) {
    sistema: sistema(id: $id) {
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
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Sistema not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ sistema }) => {
  return <Sistema sistema={sistema} />
}
