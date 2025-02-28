import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from '@mui/material'

import { useParams, routes, Link } from '@redwoodjs/router'
import { useQuery, gql } from '@redwoodjs/web'

import { useStyles } from './styles' // Asegúrate de que este archivo esté correctamente importado

// Consulta GraphQL para obtener los componentes y sus sistemas del despliegue
const GET_COMPONENTES_DEL_DESPLIEGUE = gql`
  query GetComponentesDelDespliegue($id: Int!) {
    despliegue(id: $id) {
      id
      nombre
      componentes {
        id
        nombre
        descripcion
        estado
        entorno
        categoria
        fecha_creacion
        sistemas {
          id
          id_padre
          codigo
          sigla
          nombre
          descripcion
          estado
        }
      }
    }
  }
`

const formatFecha = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleString()
}

const ComponentesDespliegue = () => {
  const { id } = useParams() // Recibe el id del despliegue desde la URL
  const { data, loading, error } = useQuery(GET_COMPONENTES_DEL_DESPLIEGUE, {
    variables: { id: parseInt(id) },
  })
  const styles = useStyles

  if (loading)
    return <Typography style={styles.typography}>Cargando datos...</Typography>

  if (error)
    return (
      <Typography color="error" style={styles.typography}>
        Error al cargar datos: {error.message}
      </Typography>
    )

  if (!data || !data.despliegue) {
    return (
      <Typography color="error" style={styles.typography}>
        No se encontró el despliegue con id {id}.
      </Typography>
    )
  }

  // Convertir componentes a arreglo, en caso de que venga como objeto único
  const componentes = data.despliegue.componentes
    ? Array.isArray(data.despliegue.componentes)
      ? data.despliegue.componentes
      : [data.despliegue.componentes]
    : []

  // Agregar y aplanar todos los sistemas de cada componente
  const sistemas = componentes.reduce((acc, componente) => {
    if (componente.sistemas) {
      return acc.concat(
        Array.isArray(componente.sistemas)
          ? componente.sistemas
          : [componente.sistemas]
      )
    }
    return acc
  }, [])

  return (
    <>
      {/* Contenedor de Sistemas */}
      <Paper style={{ padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Sistemas asociados a los componentes
        </Typography>
        {sistemas.length === 0 ? (
          <Typography style={styles.typography}>
            No hay sistemas asociados a los componentes.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ID Padre</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Sigla</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sistemas.map((sistema) => (
                  <TableRow key={sistema.id} hover>
                    <TableCell style={styles.tableCell}>{sistema.id}</TableCell>
                    <TableCell style={styles.tableCell}>
                      {sistema.id_padre}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {sistema.codigo}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {sistema.sigla}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {sistema.nombre}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {sistema.descripcion}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {sistema.estado}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      {/* Contenedor de Componentes */}
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Componentes asociados a {data.despliegue.nombre}
        </Typography>
        {componentes.length === 0 ? (
          <Typography style={styles.typography}>
            No hay componentes asociados al despliegue con id {id}.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Entorno</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Fecha de Creación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {componentes.map((componente) => (
                  <TableRow
                    key={componente.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    component={Link}
                    to={routes.componenteSelector({ id: componente.id })}
                    style={{ textDecoration: 'none' }}
                  >
                    <TableCell style={styles.tableCell}>
                      {componente.id}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {componente.nombre}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {componente.descripcion}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {componente.estado}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {componente.entorno}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {componente.categoria}
                    </TableCell>
                    <TableCell style={styles.tableCell}>
                      {formatFecha(componente.fecha_creacion)}
                    </TableCell>
                    <TableCell sx={styles.tableCell}>
                      <Link
                        to={routes.componente({ id: componente.id })}
                        title={`Mostrar detalles del componente ${componente.id}`}
                        style={{ textDecoration: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          sx={styles.button}
                        >
                          Mostrar
                        </Button>
                      </Link>
                      <Link
                        to={routes.editComponente({ id: componente.id })}
                        title={`Editar componente ${componente.id}`}
                        style={{ textDecoration: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={styles.button}
                        >
                          Editar
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </>
  )
}

export default ComponentesDespliegue
