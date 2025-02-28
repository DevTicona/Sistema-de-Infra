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

import { useParams, routes, Link } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { useStyles } from './styles' // Mantén esta importación

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
      metadata
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

const formatFecha = (fecha) => {
  const date = new Date(fecha)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

const ServidoresPage = () => {
  const { id, chasisId, bladeId } = useParams()
  const { data, loading, error } = useQuery(GET_SERVIDORES)

  // Usamos directamente el objeto styles sin invocar una función
  const styles = useStyles

  if (loading) return <p>Cargando servidores...</p>
  if (error) return <p>Error: {error.message}</p>

  const filteredServidores = data.servidors.filter((servidor) => {
    const isVirtual = servidor.tipo === 'Virtual'
    const hasMetadata =
      servidor.metadata && servidor.metadata.chasis && servidor.metadata.blade

    return (
      servidor.id_data_center === parseInt(id) &&
      isVirtual &&
      hasMetadata &&
      servidor.metadata.chasis === `CH-0${chasisId}` &&
      servidor.metadata.blade === `BL-0${bladeId}`
    )
  })

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Data Center {id} -- Chasis {chasisId} -- Blade {bladeId}
      </h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableHeadCell}>Nro Cluster</TableCell>
              <TableCell sx={styles.tableHeadCell}>VMID</TableCell>
              <TableCell sx={styles.tableHeadCell}>Nombre</TableCell>
              <TableCell sx={styles.tableHeadCell}>Nodo</TableCell>
              <TableCell sx={styles.tableHeadCell}>IP</TableCell>
              <TableCell sx={styles.tableHeadCell}>Tipo</TableCell>
              <TableCell sx={styles.tableHeadCell}>Estado</TableCell>
              <TableCell sx={styles.tableHeadCell}>Fecha Creación</TableCell>
              <TableCell sx={styles.tableHeadCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServidores.length === 0 ? (
              <TableRow>
                <TableCell colSpan="9" sx={styles.tableCell} align="center">
                  No hay servidores disponibles.
                </TableCell>
              </TableRow>
            ) : (
              filteredServidores.map((servidor) => (
                <TableRow
                  key={servidor.id}
                  hover
                  sx={styles.tableRowHover}
                  style={{ textDecoration: 'none' }}
                  component={Link}
                  to={routes.despliegueFiltro({
                    dataCenterId: id,
                    chasisId: chasisId,
                    bladeId: bladeId,
                    servidorId: servidor.id,
                  })}
                >
                  <TableCell sx={styles.tableCell}>
                    {servidor.nro_cluster}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.vmid}</TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.nombre}</TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.nodo}</TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.ip}</TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.tipo}</TableCell>
                  <TableCell sx={styles.tableCell}>{servidor.estado}</TableCell>
                  <TableCell sx={styles.tableCell}>
                    {formatFecha(servidor.fecha_creacion)}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    {/* Los botones evitan la propagación del clic */}
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default ServidoresPage
