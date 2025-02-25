import Datacenter from 'src/components/Datacenter/Datacenter'

export const QUERY = gql`
  query FindDatacenterById($id: Int!) {
    datacenter: datacenter(id: $id) {
      id
      nombre
      ubicacion
      capacidad
      estado
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Datacenter not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ datacenter }) => {
  return <Datacenter datacenter={datacenter} />
}
