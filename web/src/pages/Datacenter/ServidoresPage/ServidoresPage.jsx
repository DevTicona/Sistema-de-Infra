import { useParams, routes, Link } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'
import './ServidoresPage.css'

const GET_SERVIDORES = gql`
  query GetServidores {
    servidors {
      id
      nro_cluster
      vmid
      nombre
      nodo
      ip
      tipo
      estado
      id_data_center
      metadata
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`
const formatFecha = (fecha) => {
  const date = new Date(fecha)
  const day = date.getDate()
  const month = date.getMonth() + 1 // Los meses en JavaScript empiezan desde 0
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  // Formato: DD/MM/YYYY HH:MM:SS
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}
const ServidoresPage = () => {
  const { id, chasisId, bladeId } = useParams()
  const { data, loading, error } = useQuery(GET_SERVIDORES)

  if (loading) return <p>Cargando servidores...</p>
  if (error) return <p>Error: {error.message}</p>

  // Filtrar los servidores para asegurarse de que sean de tipo 'Virtual'
  const filteredServidores = data.servidors.filter((servidor) => {
    // Verificar que el servidor sea de tipo 'Virtual' y tenga metadata
    const isVirtual = servidor.tipo === 'Virtual'
    const hasMetadata =
      servidor.metadata && servidor.metadata.chasis && servidor.metadata.blade

    return (
      servidor.id_data_center === parseInt(id) &&
      isVirtual && // Asegurarse de que sea de tipo 'Virtual'
      hasMetadata && // Verificar que el servidor tenga 'chasis' y 'blade' en metadata
      servidor.metadata.chasis === `CH-0${chasisId}` &&
      servidor.metadata.blade === `BL-0${bladeId}`
    )
  })

  return (
    <div className="container">
      <h2 className="title">
        Data Center {id} -- Chasis -- {chasisId} -- Blade {bladeId}
      </h2>

      {/* Tabla de servidores */}
      <table className="table-container">
        <thead>
          <tr>
            <th className="border p-2">Nro Cluster</th>
            <th className="border p-2">VMID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Nodo</th>
            <th className="border p-2">IP</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Fecha Creación</th>
            <th className="border p-2">Fecha Modificación</th>
          </tr>
        </thead>
        <tbody>
          {filteredServidores.length === 0 ? (
            <tr>
              <td colSpan="7" className="border p-2 text-center">
                No hay servidores disponibles.
              </td>
            </tr>
          ) : (
            filteredServidores.map((servidor) => (
              <tr key={servidor.id}>
                <td className="border p-2">{servidor.nro_cluster}</td>
                <td className="border p-2">{servidor.vmid}</td>
                <td className="border p-2">
                  <Link
                    to={routes.despliegueFiltro({ id: servidor.id })} // Redirige a la página de detalles
                    className="rw-button rw-button-green"
                  >
                    {servidor.nombre}
                  </Link>
                </td>
                <td className="border p-2">{servidor.nodo}</td>
                <td className="border p-2">{servidor.ip}</td>
                <td className="border p-2">{servidor.tipo}</td>
                <td className="border p-2">{servidor.estado}</td>
                <td className="border p-2">
                  {formatFecha(servidor.fecha_creacion)}
                </td>
                <td className="border p-2">{servidor.fecha_modificacion}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ServidoresPage
