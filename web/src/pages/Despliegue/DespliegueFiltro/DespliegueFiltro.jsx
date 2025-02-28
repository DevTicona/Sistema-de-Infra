import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'

import { useParams, routes, Link } from '@redwoodjs/router'
import { useQuery, gql } from '@redwoodjs/web'

import { useStyles } from './styles' // Asegúrate de que este archivo esté correctamente importado

const GET_DESPLIEGES = gql`
  query GetDespliegues {
    despliegues {
      id
      agrupador
      nombre
      estado
      fecha_creacion
      id_servidor
      usuario_roles {
        usuarios {
          id
          nombre_usuario
        }
        roles {
          id
          nombre
        }
      }
    }
    servidors {
      id
      tipo
      nombre
    }
  }
`

const formatFecha = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleString()
}

const DespliegueFiltro = () => {
  const { dataCenterId, chasisId, bladeId, servidorId } = useParams()
  const { data, loading, error } = useQuery(GET_DESPLIEGES)
  const styles = useStyles

  if (loading)
    return (
      <Typography style={styles.typography}>Cargando despliegues...</Typography>
    )
  if (error)
    return (
      <Typography color="error" style={styles.typography}>
        Error al cargar los despliegues: {error.message}
      </Typography>
    )

  // Filtrar despliegues según el id del servidor
  const desplieguesFiltrados = data.despliegues.filter(
    (despliegue) => despliegue.id_servidor === parseInt(servidorId)
  )

  // Encontrar el servidor correspondiente
  const servidor = data.servidors.find(
    (servidor) => servidor.id === parseInt(servidorId)
  )

  // Determinar si el servidor es Virtual o Físico
  const isVirtual = servidor?.tipo === 'Virtual'

  return (
    <TableContainer component={Paper} style={styles.tableContainer}>
      <Typography variant="h7" style={styles.title}>
        {isVirtual
          ? `Data center ${dataCenterId} -- Chasis ${chasisId} -- Blade ${bladeId} -- Servidor: ${servidor.nombre}`
          : `Data center ${dataCenterId} -- Servidor: ${servidor.nombre}`}
      </Typography>
      {desplieguesFiltrados.length === 0 ? (
        <Typography style={styles.typography}>
          No hay despliegues asociados al servidor {servidorId}.
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={styles.tableHeadCell}>ID</TableCell>
              <TableCell style={styles.tableHeadCell}>Agrupador</TableCell>
              <TableCell style={styles.tableHeadCell}>Nombre</TableCell>
              <TableCell style={styles.tableHeadCell}>Estado</TableCell>
              <TableCell style={styles.tableHeadCell}>
                Fecha de Creación
              </TableCell>
              <TableCell style={styles.tableHeadCell}>Usuario</TableCell>
              <TableCell style={styles.tableHeadCell}>Rol</TableCell>
              <TableCell style={styles.tableHeadCell}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {desplieguesFiltrados.map((despliegue) => {
              // Se asume que usuario_roles es un arreglo. Si no hay asignación se muestra "N/A"
              const usuario =
                despliegue.usuario_roles &&
                despliegue.usuario_roles.length > 0 &&
                despliegue.usuario_roles[0].usuarios
                  ? despliegue.usuario_roles[0].usuarios.nombre_usuario
                  : 'N/A'
              const rol =
                despliegue.usuario_roles &&
                despliegue.usuario_roles.length > 0 &&
                despliegue.usuario_roles[0].roles
                  ? despliegue.usuario_roles[0].roles.nombre
                  : 'N/A'

              return (
                <TableRow
                  key={despliegue.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  component={Link}
                  to={routes.componenteSelector({ id: despliegue.id })}
                  style={{ textDecoration: 'none' }}
                >
                  <TableCell style={styles.tableCell}>
                    {despliegue.id}
                  </TableCell>
                  <TableCell style={styles.tableCell}>
                    {despliegue.agrupador}
                  </TableCell>
                  <TableCell style={styles.tableCell}>
                    {despliegue.nombre}
                  </TableCell>
                  <TableCell style={styles.tableCell}>
                    {despliegue.estado}
                  </TableCell>
                  <TableCell style={styles.tableCell}>
                    {formatFecha(despliegue.fecha_creacion)}
                  </TableCell>
                  <TableCell style={styles.tableCell}>{usuario}</TableCell>
                  <TableCell style={styles.tableCell}>{rol}</TableCell>
                  <TableCell sx={styles.tableCell}>
                    <Link
                      to={routes.despliegue({ id: despliegue.id })}
                      title={`Show despliegue ${despliegue.id} detail`}
                      style={{ textDecoration: 'none' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        sx={styles.button}
                      >
                        Show
                      </Button>
                    </Link>
                    <Link
                      to={routes.editDespliegue({ id: despliegue.id })}
                      title={`Edit despliegue ${despliegue.id}`}
                      style={{ textDecoration: 'none' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={styles.button}
                      >
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  )
}

export default DespliegueFiltro
