import Servidorcontenedor from 'src/components/Servidorcontenedor/Servidorcontenedor'

export const QUERY = gql`
  query FindServidorcontenedorById($id: Int!) {
    servidorcontenedor: servidorcontenedor(id: $id) {
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

export const Empty = () => <div>Servidorcontenedor not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ servidorcontenedor }) => {
  return <Servidorcontenedor servidorcontenedor={servidorcontenedor} />
}
