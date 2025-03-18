import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
} from '@mui/material'

import { Link, routes } from '@redwoodjs/router'
import { useParams } from '@redwoodjs/router' // Importa useParams
import { useQuery } from '@redwoodjs/web'

import { QUERY } from 'src/components/Servidor/ServidorCell'

import { useStyles } from './styles' // Asegúrate de que este archivo esté correctamente importado

const formatFecha = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleString()
}
const ServComponentes = () => {
  const { dataCenterId, chasisId, bladeId, servidorId } = useParams()
  const { data, loading, error } = useQuery(QUERY, {
    variables: { id: parseInt(servidorId) }, // Convierte el id a entero
  })
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

  // Determinar si el servidor es Virtual o Físico
  const isVirtual = data.servidor?.tipo === 'Virtual'
  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        <Typography variant="h7" style={styles.title}>
          {isVirtual
            ? `Data center ${dataCenterId} -- Chasis ${chasisId} -- Blade ${bladeId} -- Servidor: ${data.servidor.nombre}`
            : `Data center ${dataCenterId} -- Servidor: ${data.servidor.nombre}`}
        </Typography>
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Componente</TableCell>
              <TableCell>Entorno</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Sistema asociado al componente</TableCell>
              <TableCell>Agrupador</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado Despliegue</TableCell>
              <TableCell>Fecha de Creación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.servidor.despliegue.map((despliegue) => (
              <TableRow key={despliegue.id} hover>
                <TableCell>{despliegue.id}</TableCell>
                <TableCell>
                  <Link
                    to={routes.componente({
                      id: despliegue.componentes.id,
                    })}
                  >
                    {despliegue?.componentes?.nombre || 'N/A'}
                  </Link>
                </TableCell>
                <TableCell>{despliegue.componentes.entorno}</TableCell>
                <TableCell>{despliegue.componentes.categoria}</TableCell>
                <TableCell>
                  <Link
                    to={routes.sistema({
                      id: despliegue.componentes.sistemas.id,
                    })}
                  >
                    {despliegue?.componentes?.sistemas?.nombre || 'N/A'}
                  </Link>
                </TableCell>
                <TableCell>{despliegue.agrupador}</TableCell>
                <TableCell>{despliegue.tipo}</TableCell>
                <TableCell>{despliegue.estado}</TableCell>
                <TableCell>{formatFecha(despliegue.fecha_creacion)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default ServComponentes
