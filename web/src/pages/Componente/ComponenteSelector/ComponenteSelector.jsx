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
import { useQuery } from '@redwoodjs/web'

import { QUERY } from 'src/components/Sistema/SistemaCell'

const ComponenteSelector = () => {
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
        Componentes del sistema: {data.sistema.nombre}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Entorno</TableCell>
              <TableCell>Categoría</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.sistema.componentes.map((componente) => (
              <TableRow key={componente.id} hover>
                <TableCell>{componente.id}</TableCell>
                <TableCell>{componente.nombre}</TableCell>
                <TableCell>{componente.descripcion}</TableCell>
                <TableCell>{componente.estado}</TableCell>
                <TableCell>{componente.entorno}</TableCell>
                <TableCell>{componente.categoria}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default ComponenteSelector
