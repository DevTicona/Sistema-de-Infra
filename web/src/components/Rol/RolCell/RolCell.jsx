import Rol from 'src/components/Rol/Rol'

export const QUERY = gql`
  query FindRolById($id: Int!) {
    rol: rol(id: $id) {
      id
      nombre
      tipo
      estado
      privilegios
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Rol not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ rol }) => {
  return <Rol rol={rol} />
}
