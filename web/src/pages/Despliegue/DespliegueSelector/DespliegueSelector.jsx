import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'

import { useParams } from '@redwoodjs/router' // Importa useParams
import { useQuery, gql } from '@redwoodjs/web'

export const QUERY = gql`
  query ObtenerServidoresById($id: Int!) {
    servidor: servidor(id: $id) {
      id
      nombre
      despliegue {
        id
        agrupador
        tipo
        estado
        fecha_creacion
        componentes {
          id
          nombre
          sistemas {
            id
            nombre
          }
        }
      }
    }
  }
`

const DespliegueSelector = () => {
  const { id } = useParams() // Captura el id desde la URL
  const { loading, error, data } = useQuery(QUERY, {
    variables: { id: parseInt(id) }, // Convierte el id a entero
  })

  if (loading)
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
  if (error) return <Alert severity="error">Error: {error.message}</Alert>

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Despliegues del servidor: {data.servidor.nombre}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Componente</TableCell>
              <TableCell>Sistema asociado al componente</TableCell>
              <TableCell>Agrupador</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de Creación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.servidor.despliegue.map((despliegue) => (
              <TableRow key={despliegue.id} hover>
                <TableCell>{despliegue.id}</TableCell>
                <TableCell>{despliegue.componentes.nombre}</TableCell>
                <TableCell>{despliegue.componentes.sistemas.nombre}</TableCell>
                <TableCell>{despliegue.agrupador}</TableCell>
                <TableCell>{despliegue.tipo}</TableCell>
                <TableCell>{despliegue.estado}</TableCell>
                <TableCell>{despliegue.fecha_creacion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default DespliegueSelector
