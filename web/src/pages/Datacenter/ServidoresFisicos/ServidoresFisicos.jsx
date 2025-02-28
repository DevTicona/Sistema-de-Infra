import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

import { useParams, Link, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { useStyles } from './styles'

const GET_SERVIDORES = gql`
  query ObtenerServidores {
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
  return date.toLocaleString()
}

const ServidoresFisicos = () => {
  const { id } = useParams() // Obtener el id del data center desde la URL

  // Usamos useQuery para obtener todos los servidores
  const { data, loading, error } = useQuery(GET_SERVIDORES)

  // Obtener los estilos desde el archivo separado
  const styles = useStyles

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
    <div className="container" style={styles.container}>
      <h1 className="title" style={styles.title}>
        Servidores Físicos del Data Center {id}
      </h1>

      {servidoresFisicos.length === 0 ? (
        <p>No hay servidores físicos registrados en este data center.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>ID</TableCell>
                <TableCell sx={styles.tableHeadCell}>Nombre</TableCell>
                <TableCell sx={styles.tableHeadCell}>Tipo</TableCell>
                <TableCell sx={styles.tableHeadCell}>IP</TableCell>
                <TableCell sx={styles.tableHeadCell}>Estado</TableCell>
                <TableCell sx={styles.tableHeadCell}>Nodo</TableCell>
                <TableCell sx={styles.tableHeadCell}>
                  Fecha de Creación
                </TableCell>
                <TableCell sx={styles.tableHeadCell}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servidoresFisicos.map((servidor) => (
                <TableRow
                  key={servidor.id}
                  hover
                  sx={styles.tableRowHover}
                  component={Link}
                  to={routes.despliegueFiltro({
                    dataCenterId: id,
                    chasisId: 1,
                    bladeId: 1,
                    servidorId: servidor.id,
                  })}
                  style={{ textDecoration: 'none' }} // Elimina la línea de subrayado del enlace
                  onClick={(e) => e.stopPropagation()}
                >
                  <TableCell sx={styles.tableCell}>{servidor.id}</TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.nombre}</TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.tipo}</TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.ip}</TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.estado}</TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.nodo}</TableCell>
                  <TableCell sx={styles.tableCell}>
                    {formatFecha(servidor.fecha_creacion)}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    <Link
                      to={routes.servidor({ id: servidor.id })}
                      title={'Show servidor ' + servidor.id + ' detail'}
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
                      to={routes.editServidor({ id: servidor.id })}
                      title={'Edit servidor ' + servidor.id}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}

export default ServidoresFisicos
