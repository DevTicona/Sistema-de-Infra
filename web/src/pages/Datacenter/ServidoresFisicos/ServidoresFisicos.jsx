import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, routes, useParams } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import {
  Button,
  TablePagination,
  Checkbox,
  Table,
  TableBody,
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Paper,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { ColumnConfigContext } from 'src/context/ColumnConfigContext'
import { useRefresh } from 'src/context/RefreshContext'
import { useSearch } from 'src/context/SearchContext'
import { TableDataContext } from 'src/context/TableDataContext'

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

const DELETE_SERVIDOR_MUTATION = gql`
  mutation DeleteServidorMutation($id: Int!) {
    deleteServidor(id: $id) {
      id
    }
  }
`

const formatFecha = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleString()
}

const ServidoresFisicos = () => {
  // Se obtiene el id del data center desde la URL
  const { id } = useParams()
  const styles = useStyles

  // Consulta de todos los servidores
  const { data, loading, error, refetch } = useQuery(GET_SERVIDORES)
  // Contexto para filtrado global
  const { search } = useSearch()
  // Contexto para refrescar
  const { refresh } = useRefresh()
  // Contextos para configuración y datos de tabla
  const { setTableData, setTableConfig } = useContext(TableDataContext)
  const { currentTable, setCurrentTableConfig } = useContext(ColumnConfigContext)

  // Estado local para almacenar los servidores filtrados por data center y tipo 'Fisico'
  const [servidoresData, setServidoresData] = useState([])

  // Estado para la paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Actualizar estado local al recibir los datos
  useEffect(() => {
    if (data && data.servidors) {
      const filtrados = data.servidors.filter(
        (servidor) =>
          servidor.id_data_center === parseInt(id) && servidor.tipo === 'Fisico'
      )
      setServidoresData(filtrados)
    }
  }, [data, id])

  // Refrescar datos cuando se active el flag de refresh
  useEffect(() => {
    if (refresh) {
      refetch().then(({ data }) => {
        if (data && data.servidors) {
          const filtrados = data.servidors.filter(
            (servidor) =>
              servidor.id_data_center === parseInt(id) && servidor.tipo === 'Fisico'
          )
          setServidoresData(filtrados)
        }
      })
    }
  }, [refresh, refetch, id])

  // Mutación para eliminar servidor
  const [deleteServidor] = useMutation(DELETE_SERVIDOR_MUTATION, {
    onCompleted: () => {
      toast.success('Servidor eliminado')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete servidor ' + id + '?')) {
      deleteServidor({ variables: { id } })
    }
  }

  // Filtrado adicional según el término de búsqueda global
  const filteredServidores = useMemo(() => {
    const lowerSearch = search?.toLowerCase() || ''
    return servidoresData.filter((servidor) => {
      return (
        String(servidor.id).toLowerCase().includes(lowerSearch) ||
        servidor.nombre?.toLowerCase().includes(lowerSearch) ||
        servidor.nodo?.toLowerCase().includes(lowerSearch) ||
        servidor.ip?.toLowerCase().includes(lowerSearch) ||
        servidor.tipo?.toLowerCase().includes(lowerSearch) ||
        servidor.estado?.toLowerCase().includes(lowerSearch)
      )
    })
  }, [search, servidoresData])

  // Estado para selección de filas
  const [selectedServidores, setSelectedServidores] = useState([])

  // Configuración inicial de columnas para esta tabla
  const tableName = 'ServidoresFisicos'
  const initialColumns = useMemo(
    () => [
      { name: 'checkbox', label: '', visible: true, type: 'checkbox' },
      { name: 'id', label: 'ID', visible: true },
      { name: 'nro_cluster', label: 'Nro Cluster', visible: true },
      { name: 'vmid', label: 'VMID', visible: true },
      { name: 'nombre', label: 'Nombre', visible: true },
      { name: 'nodo', label: 'Nodo', visible: true },
      { name: 'ip', label: 'IP', visible: true },
      { name: 'tipo', label: 'Tipo', visible: true },
      { name: 'estado', label: 'Estado', visible: true },
      { name: 'fecha_creacion', label: 'Fecha Creación', visible: true },
    ],
    []
  )

  // Configurar la tabla si aún no se ha configurado o si es una tabla diferente
  useEffect(() => {
    if (!currentTable || currentTable.tableName !== tableName) {
      setCurrentTableConfig({ tableName, columns: initialColumns })
    }
  }, [currentTable, setCurrentTableConfig, initialColumns, tableName])

  // Determinar las columnas a mostrar
  const columnsToDisplay =
    currentTable && currentTable.tableName === tableName
      ? currentTable.columns.filter((col) => col.visible)
      : initialColumns

  // Actualizar datos y configuración de la tabla en el contexto
  useEffect(() => {
    setTableData(filteredServidores)
    setTableConfig({
      tableName,
      filas: selectedServidores,
      columns: columnsToDisplay,
    })
  }, [
    filteredServidores,
    selectedServidores,
    columnsToDisplay,
    setTableData,
    setTableConfig,
    tableName,
  ])

  // Manejadores de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Función para renderizar el contenido de cada celda según el nombre de la columna
  const renderCell = (servidor, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <Checkbox
            checked={selectedServidores.includes(servidor.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedServidores([...selectedServidores, servidor.id])
              } else {
                setSelectedServidores(
                  selectedServidores.filter((id) => id !== servidor.id)
                )
              }
            }}
          />
        )
      case 'id':
        return servidor.id
      case 'nro_cluster':
        return servidor.nro_cluster
      case 'vmid':
        return servidor.vmid
      case 'nombre':
        return (
          <Link to={routes.servidor({ id: servidor.id })} style={{ textDecoration: 'none' }}>
            {servidor.nombre}
          </Link>
        )
      case 'nodo':
        return servidor.nodo
      case 'ip':
        return servidor.ip
      case 'tipo':
        return servidor.tipo
      case 'estado':
        return servidor.estado
      case 'fecha_creacion':
        return formatFecha(servidor.fecha_creacion)
      default:
        return ''
    }
  }

  // Filas a mostrar en la página actual
  const pageRows = filteredServidores.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )
  const allSelected =
    pageRows.length > 0 &&
    pageRows.every((s) => selectedServidores.includes(s.id))

  if (loading) {
    return <div>Cargando servidores físicos...</div>
  }

  if (error) {
    return <div>Error al cargar los servidores físicos: {error.message}</div>
  }

  return (
    <div className="container" style={styles.container}>
      <h1 className="title" style={styles.title}>
        Servidores Físicos del Data Center {id}
      </h1>
      {filteredServidores.length === 0 ? (
        <p>No hay servidores físicos registrados en este data center.</p>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={allSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedServidores(pageRows.map((s) => s.id))
                        } else {
                          setSelectedServidores(
                            selectedServidores.filter(
                              (id) => !pageRows.some((s) => s.id === id)
                            )
                          )
                        }
                      }}
                    />
                  </TableCell>
                  {columnsToDisplay
                    .filter((col) => col.name !== 'checkbox')
                    .map((col) => (
                      <TableCell key={col.name}>
                        <TableSortLabel>{col.label}</TableSortLabel>
                      </TableCell>
                    ))}
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageRows.map((servidor) => (
                  <TableRow key={servidor.id} hover>
                    {columnsToDisplay.map((col) => (
                      <TableCell key={col.name}>
                        {renderCell(servidor, col.name)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          component={Link}
                          to={routes.servidor({ id: servidor.id })}
                          title={'Show servidor ' + servidor.id + ' detail'}
                          size="small"
                          color="success"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          component={Link}
                          to={routes.editServidor({ id: servidor.id })}
                          title={'Edit servidor ' + servidor.id}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          title={'Delete servidor ' + servidor.id}
                          onClick={() => onDeleteClick(servidor.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredServidores.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  )
}

export default ServidoresFisicos
