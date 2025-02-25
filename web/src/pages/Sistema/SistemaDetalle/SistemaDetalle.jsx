import { gql } from '@apollo/client'

import { useParams } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'
import './SistemaDetalle.css'

// Consulta GraphQL para obtener detalles del sistema
const SISTEMA_DETALLE_QUERY = gql`
  query GetSistemaDetalle($id: Int!) {
    sistema(id: $id) {
      nombre
      entidades {
        nombre
      }
      componentes {
        nombre
        despliegue {
          nombre
          contenedor_logico {
            nombre
            servidor_contenedor {
              servidores {
                nombre
              }
            }
          }
        }
      }
      usuario_roles {
        usuarios {
          nombre_usuario
        }
        roles {
          nombre
        }
      }
    }
  }
`

// Función auxiliar para convertir cualquier valor en un arreglo
const toArray = (value) => {
  if (value === null || value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

// Función para aplanar la estructura de datos
const flattenSistemaData = (sistema) => {
  const entidades = toArray(sistema.entidades).map((ent) => ent.nombre) || [
    'N/A',
  ]
  const componentes = toArray(sistema.componentes)
  const usuarioRoles = toArray(sistema.usuario_roles)

  const usuarios =
    usuarioRoles
      .flatMap((ur) => toArray(ur.usuarios).map((usr) => usr.nombre_usuario))
      .join(', ') || 'N/A'

  const roles =
    usuarioRoles
      .flatMap((ur) => toArray(ur.roles).map((rol) => rol.nombre))
      .join(', ') || 'N/A'

  const rows = []

  if (componentes.length > 0) {
    // Si hay componentes, iteramos sobre ellos
    componentes.forEach((componente) => {
      const despliegues = toArray(componente.despliegue)

      if (despliegues.length > 0) {
        // Si hay despliegues, recorrerlos normalmente
        despliegues.forEach((despliegue) => {
          toArray(despliegue.contenedor_logico).forEach((contenedor) => {
            const servidores =
              toArray(contenedor?.servidor_contenedor)
                .flatMap((servidorContenedor) =>
                  toArray(servidorContenedor.servidores).map(
                    (srv) => srv.nombre
                  )
                )
                .join(', ') || 'N/A'

            rows.push({
              entidades: entidades.join(', '),
              componente: componente.nombre || 'N/A',
              despliegue: despliegue.nombre || 'N/A',
              contenedor: contenedor?.nombre || 'N/A',
              servidores,
              usuarios,
              roles,
            })
          })
        })
      } else {
        // Si NO hay despliegues, igualmente agregamos el componente
        rows.push({
          entidades: entidades.join(', '),
          componente: componente.nombre || 'N/A',
          despliegue: 'N/A',
          contenedor: 'N/A',
          servidores: 'N/A',
          usuarios: 'N/A',
          roles: 'N/A',
        })
      }
    })
  } else {
    // Si no hay componentes pero sí hay entidades o usuarios/roles, agregamos una fila mínima
    rows.push({
      entidades: entidades.join(', '),
      componente: 'N/A',
      despliegue: 'N/A',
      contenedor: 'N/A',
      servidores: 'N/A',
      usuarios: 'N/A',
      roles: 'N/A',
    })
  }

  return rows
}

const SistemaDetalle = () => {
  const { id } = useParams()
  const { data, loading, error } = useQuery(SISTEMA_DETALLE_QUERY, {
    variables: { id: parseInt(id, 10) },
  })

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  const sistema = data?.sistema || {}
  const rows = flattenSistemaData(sistema)
  console.log('Respuesta de la consulta GraphQL:', data)

  return (
    <div className="SistemaDetalle">
      <h1>Detalles del Sistema {sistema.nombre || 'N/A'}</h1>
      <table>
        <thead>
          <tr>
            <th>Entidades</th>
            <th>Componente</th>
            <th>Despliegue</th>
            <th>Contenedor Lógico</th>
            <th>Servidores</th>
            <th>Usuarios</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr key={index}>
                <td>{row.entidades}</td>
                <td>{row.componente}</td>
                <td>{row.despliegue}</td>
                <td>{row.contenedor}</td>
                <td>{row.servidores}</td>
                <td>{row.usuarios}</td>
                <td>{row.roles}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No se encontraron datos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SistemaDetalle
