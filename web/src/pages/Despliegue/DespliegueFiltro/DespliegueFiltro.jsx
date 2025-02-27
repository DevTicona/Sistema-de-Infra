import { useParams, Link, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'
import './DespliegueFiltro.css'

const GET_DESPLIEGUES = gql`
  query GetDespliegues {
    despliegues {
      id
      agrupador
      nombre
      estado
      fecha_creacion
      id_servidor
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

const DespliegueFiltro = () => {
  const { id } = useParams() // Obtener el id del servidor desde la URL

  // Usamos useQuery para obtener todos los despliegues
  const { data, loading, error } = useQuery(GET_DESPLIEGUES, {
    variables: { id_servidor: parseInt(id) },
  })

  if (loading) {
    return <div>Cargando despliegues...</div>
  }

  if (error) {
    return <div>Error al cargar los despliegues: {error.message}</div>
  }

  // Filtrar los despliegues que pertenecen al servidor actual
  const desplieguesFiltrados = data.despliegues.filter(
    (despliegue) => despliegue.id_servidor === parseInt(id)
  )

  return (
    <div className="container">
      <h1 className="title">Despliegues Asociados al Servidor {id}</h1>

      {desplieguesFiltrados.length === 0 ? (
        <p>No hay despliegues asociados al servidor {id}.</p>
      ) : (
        <table className="despliegue-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>agrupador</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Fecha de Creación</th>
            </tr>
          </thead>
          <tbody>
            {desplieguesFiltrados.map((despliegue) => (
              <tr key={despliegue.id}>
                <td>
                  <Link
                    to={routes.despliegue({ id: despliegue.id })}
                    title={'Ver detalle del despliegue ' + despliegue.id}
                    className="rw-button rw-button-small rw-button-green"
                  >
                    {despliegue.id}
                  </Link>
                </td>
                <td>{despliegue.agrupador}</td>
                <td>{despliegue.nombre}</td>
                <td>{despliegue.estado}</td>
                <td>{formatFecha(despliegue.fecha_creacion)}</td>
                <td>
                  <nav className="rw-table-actions">
                    <Link
                      to={routes.despliegue({ id: despliegue.id })}
                      title={'Ver detalle del despliegue ' + despliegue.id}
                      className="rw-button rw-button-small rw-button-blue"
                    >
                      Ver
                    </Link>
                    <Link
                      to={routes.editDespliegue({ id: despliegue.id })}
                      title={'Editar despliegue ' + despliegue.id}
                      className="rw-button rw-button-small rw-button-blue"
                    >
                      Editar
                    </Link>
                  </nav>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default DespliegueFiltro
