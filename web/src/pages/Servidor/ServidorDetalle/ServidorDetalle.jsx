import { gql } from '@apollo/client'

import { useParams } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'
import './ServidorDetalle.css'

// Definimos la consulta GraphQL para obtener los detalles del servidor
const SERVIDOR_DETALLE_QUERY = gql`
  query GetServidorDetalle($id: Int!) {
    servidor(id: $id) {
      nombre
      servidor_contenedor {
        contenedor_logico {
          nombre
          despliegue {
            nombre
            componentes {
              nombre
              sistemas {
                nombre
              }
            }
          }
        }
      }
      cuchillas {
        nombre
        racks {
          nombre
          data_centers {
            nombre
          }
        }
      }
    }
  }
`

const ServidorDetalle = () => {
  // Obtenemos el id del servidor de la URL
  const { id } = useParams()

  // Usamos el hook useQuery para obtener los datos de la consulta
  const { data, loading, error } = useQuery(SERVIDOR_DETALLE_QUERY, {
    variables: { id: parseInt(id, 10) }, // Pasamos el id como parámetro
  })

  // Manejamos el estado de la carga de los datos
  if (loading) return <div>Cargando...</div> // Mostramos un mensaje mientras se cargan los datos
  if (error) return <div>Error: {error.message}</div> // Mostramos un mensaje si ocurre un error

  // Extraemos los datos del servidor de la respuesta de la consulta
  const { servidor } = data || {}

  // Si no se encuentran datos del servidor, mostramos un mensaje
  if (!servidor) return <div>No se encontraron datos del servidor.</div>

  console.log('Datos: ', servidor)

  return (
    <div className="ServidorDetalle">
      {/* Título con el nombre del servidor */}
      <h1>Detalles del Servidor {servidor.nombre}</h1>

      {/* Tabla para mostrar los detalles del servidor */}
      <table>
        <thead>
          <tr>
            {/* Encabezados de la tabla */}
            <th>Contenedor Lógico</th>
            <th>Despliegue</th>
            <th>Componentes</th>
            <th>Sistemas</th>
            <th>Blade</th>
            <th>Rack</th>
            <th>Data center</th>
          </tr>
        </thead>
        <tbody>
          {servidor.servidor_contenedor?.length > 0 ? (
            servidor.servidor_contenedor.map((sc, index) => {
              const contenedor = sc.contenedor_logico
              const despliegues = contenedor?.despliegue || [] // Despliegue es un array
              console.log('Contenedor: ', contenedor)
              console.log('Despliegues: ', despliegues)

              return (
                <>
                  {despliegues.length > 0 ? (
                    despliegues.map((despliegue, depIndex) => {
                      const componentes = despliegue?.componentes || [] // Componentes es un array
                      const sistemas = componentes?.sistemas || [] // Componentes es un array
                      const cuchillas = servidor?.cuchillas || []
                      const racks = cuchillas?.racks || []
                      const data_centers = racks?.data_centers || []
                      console.log('Despliegue: ', despliegue)
                      console.log('Componentes: ', componentes)
                      console.log('Ssitemas: ', sistemas)
                      console.log('cuchillass: ', cuchillas)
                      return (
                        <tr key={`${index}-${depIndex}`}>
                          <td>{contenedor?.nombre || 'N/A'}</td>
                          <td>{despliegue?.nombre || 'N/A'}</td>
                          <td>{componentes?.nombre || 'N/A'}</td>
                          <td>{sistemas?.nombre || 'N/A'}</td>
                          <td>{cuchillas?.nombre || 'N/A'}</td>
                          <td>{racks?.nombre || 'N/A'}</td>
                          <td>{data_centers?.nombre || 'N/A'}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr key={index}>
                      <td colSpan="3">
                        No hay despliegues asociados a este contenedor.
                      </td>
                    </tr>
                  )}
                </>
              )
            })
          ) : (
            <tr>
              <td colSpan="3">
                No hay contenedores asociados a este servidor.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ServidorDetalle
