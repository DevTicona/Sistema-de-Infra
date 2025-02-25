import Servidor from 'src/components/Servidor/Servidor'

export const QUERY = gql`
  query FindServidorById($id: Int!) {
    servidor: servidor(id: $id) {
      id
      nro_cluster
      vmid
      nombre
      nodo
      ip
      tipo
      estado
      metadata
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
      id_cuchilla
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Servidor not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ servidor }) => {
  return <Servidor servidor={servidor} />
}
