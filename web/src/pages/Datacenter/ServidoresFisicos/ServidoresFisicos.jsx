import { useParams, Link, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'
import './ServidoresFisicos.css'

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
      fecha_creacion
      fecha_modificacion
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

const ServidoresFisicos = () => {
  const { id } = useParams() // Obtener el id del data center desde la URL

  // Usamos useQuery para obtener todos los servidores
  const { data, loading, error } = useQuery(GET_SERVIDORES)

  if (loading) {
    return <div>Cargando servidores físicos...</div>
  }

  if (error) {
    return <div>Error al cargar los servidores físicos: {error.message}</div>
  }

  // Filtrar los servidores que pertenecen al data center actual y son de tipo "Fisico"
  const servidoresFisicos = data.servidors.filter(
    (servidor) =>
      servidor.id_data_center === parseInt(id) && servidor.tipo === 'Fisico'
  )

  return (
    <div className="container">
      <h1 className="title">Servidores Físicos del Data Center {id}</h1>

      {servidoresFisicos.length === 0 ? (
        <p>No hay servidores físicos registrados en este data center.</p>
      ) : (
        <table className="table-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>IP</th>
              <th>Estado</th>
              <th>Nodo</th>
              <th>Fecha de Creación</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {servidoresFisicos.map((servidor) => (
              <tr key={servidor.id}>
                <td>{servidor.id}</td>
                <td>
                  <Link
                    to={routes.despliegueFiltro({ id: servidor.id })} // Redirige a la página de detalles
                    className="rw-button rw-button-green"
                  >
                    {servidor.nombre}
                  </Link>
                </td>
                <td>{servidor.tipo}</td>
                <td>{servidor.ip}</td>
                <td>{servidor.estado}</td>
                <td>{servidor.nodo}</td>
                <td>{formatFecha(servidor.fecha_creacion)}</td>
                <td>
                  <Link
                    to={routes.servidor({ id: servidor.id })}
                    title={'Show servidor ' + servidor.id + ' detail'}
                    className="rw-button rw-button-small rw-button-red"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editServidor({ id: servidor.id })}
                    title={'Edit servidor ' + servidor.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ServidoresFisicos
