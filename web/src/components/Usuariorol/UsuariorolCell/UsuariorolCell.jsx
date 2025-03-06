import Usuariorol from 'src/components/Usuariorol/Usuariorol'

export const QUERY = gql`
  query FindUsuariorolById($id: Int!) {
    usuariorol: usuariorol(id: $id) {
      id
      id_usuario
      id_rol
      id_despliegue
      id_sistema
      estado
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
      usuarios {
        id
        nombre_usuario
      }
      roles {
        id
        nombre
      }
      sistemas {
        id
        nombre
      }
      despliegue {
        id
        nombre
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Usuariorol not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ usuariorol }) => {
  return <Usuariorol usuariorol={usuariorol} />
}
