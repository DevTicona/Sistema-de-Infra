import Contenedorlogico from 'src/components/Contenedorlogico/Contenedorlogico'

export const QUERY = gql`
  query FindContenedorlogicoById($id: Int!) {
    contenedorlogico: contenedorlogico(id: $id) {
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

export const Empty = () => <div>Contenedorlogico not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ contenedorlogico }) => {
  return <Contenedorlogico contenedorlogico={contenedorlogico} />
}
