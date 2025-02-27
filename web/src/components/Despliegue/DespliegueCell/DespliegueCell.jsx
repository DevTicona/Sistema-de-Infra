import Despliegue from 'src/components/Despliegue/Despliegue'

export const QUERY = gql`
  query FindDespliegueById($id: Int!) {
    despliegue: despliegue(id: $id) {
      id
      id_componente
      id_servidor
      agrupador
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

export const Empty = () => <div>Despliegue not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ despliegue }) => {
  return <Despliegue despliegue={despliegue} />
}
