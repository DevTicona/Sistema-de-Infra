import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useQuery, useMutation } from '@redwoodjs/web' // Añadido useQuery
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
} from '@mui/icons-material'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Checkbox,
  Stack,
  Chip,
} from '@mui/material'
import { Link, routes } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/toast'
import { QUERY } from 'src/components/Componente/ComponentesCell'
import { ColumnConfigContext } from 'src/context/ColumnConfigContext'
import { useRefresh } from 'src/context/RefreshContext'
import { useSearch } from 'src/context/SearchContext'
import { TableDataContext } from 'src/context/TableDataContext'
import { truncate } from 'src/lib/formatters'

// Añadido: Query para obtener los usuarios
const GET_USUARIOS_QUERY = gql`
  query UsuariosQuery {
    usuarios {
      id
      nombre_usuario
    }
  }
`

const DELETE_COMPONENTE_MUTATION = gql`
  mutation DeleteComponenteMutation($id: Int!) {
    deleteComponente(id: $id) {
      id
    }
  }
`

// Función para formatear fechas
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ComponentesList = ({ componentes }) => {
  const { search } = useSearch()
  const { refresh } = useRefresh()
  const { setTableData, setTableConfig } = useContext(TableDataContext)
  const { setCurrentTableConfig, currentTable } = useContext(ColumnConfigContext)

  // Añadido: Obtener usuarios
  const { data: usuariosData } = useQuery(GET_USUARIOS_QUERY)
  const usuariosMap = useMemo(() => {
    return usuariosData?.usuarios?.reduce((acc, usuario) => {
      acc[usuario.id] = usuario.nombre_usuario
      return acc
    }, {}) || {}
  }, [usuariosData])

  const [componentesData, setComponentesData] = useState(componentes)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('id')
  const [order, setOrder] = useState('asc')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedComponentes, setSelectedComponentes] = useState([])

  const [deleteComponente] = useMutation(DELETE_COMPONENTE_MUTATION, {
    onCompleted: () => {
      toast.success('Componente eliminado')
      setDeleteDialogOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  // Configuración inicial de columnas
  const tableName = 'Componentes'
  const initialColumns = useMemo(
    () => [
      { name: 'checkbox', label: '', visible: true, type: 'checkbox' },
      { name: 'id', label: 'Id', visible: true },
      { name: 'sistema', label: 'Sistema Asociado', visible: true },
      { name: 'nombre', label: 'Nombre', visible: true },
      { name: 'descripcion', label: 'Descripción', visible: true },
      { name: 'estado', label: 'Estado', visible: true },
      { name: 'entorno', label: 'Entorno', visible: true },
      { name: 'categoria', label: 'Categoría', visible: true },
      { name: 'despliegues', label: 'Despliegues', visible: true },
      { name: 'servidores', label: 'Servidores', visible: true },
      { name: 'fecha_creacion', label: 'Fecha Creación', visible: true },
      { name: 'usuario_creacion', label: 'Usuario Creación', visible: true },
      { name: 'fecha_modificacion', label: 'Fecha Modificación', visible: false },
      { name: 'usuario_modificacion', label: 'Usuario Modificación', visible: false },
    ],
    []
  )

  useEffect(() => {
    if (!currentTable || currentTable.tableName !== tableName) {
      setCurrentTableConfig({ tableName, columns: initialColumns })
    }
  }, [setCurrentTableConfig, tableName, initialColumns, currentTable])

  const columnsToDisplay = currentTable?.tableName === tableName
    ? currentTable.columns.filter(col => col.visible)
    : initialColumns

  // Actualizar contexto de datos de tabla
  useEffect(() => {
    setTableData(componentesData)
    setTableConfig({
      tableName,
      filas: selectedComponentes,
      columns: columnsToDisplay,
    })
  }, [componentesData, selectedComponentes, columnsToDisplay, setTableData, setTableConfig])

  // Manejo de selección
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedComponentes(filteredComponentes.map(c => c.id))
      return
    }
    setSelectedComponentes([])
  }

  const handleSelectOne = (id) => (event) => {
    if (event.target.checked) {
      setSelectedComponentes(prev => [...prev, id])
    } else {
      setSelectedComponentes(prev => prev.filter(item => item !== id))
    }
  }

  // Ordenamiento
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortedData = useMemo(() => {
    return [...componentes].sort((a, b) => {
      let aValue, bValue
      if (orderBy === 'sistema') {
        aValue = a.sistemas?.nombre?.toLowerCase() || ''
        bValue = b.sistemas?.nombre?.toLowerCase() || ''
      } else {
        aValue = (a[orderBy] || '').toString().toLowerCase()
        bValue = (b[orderBy] || '').toString().toLowerCase()
      }
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })
  }, [componentes, order, orderBy])

  // Filtrado
  const filteredComponentes = useMemo(() => {
    const lowerSearch = search.toLowerCase()
    return sortedData.filter(c =>
      c.nombre?.toLowerCase().includes(lowerSearch) ||
      c.sistemas?.nombre?.toLowerCase().includes(lowerSearch) ||
      c.entorno?.toLowerCase().includes(lowerSearch) ||
      c.categoria?.toLowerCase().includes(lowerSearch) ||
      c.despliegue?.some(d =>
        d.tipo?.toLowerCase().includes(lowerSearch) ||
        d.agrupador?.toLowerCase().includes(lowerSearch) ||
        d.servidores?.nombre?.toLowerCase().includes(lowerSearch)
      )
    )
  }, [search, sortedData])

  // Renderizado de celdas
  const renderCell = (componente, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <Checkbox
            checked={selectedComponentes.includes(componente.id)}
            onChange={handleSelectOne(componente.id)}
          />
        )
      case 'id':
        return truncate(componente.id)
      case 'sistema':
        return (
          <Link to={routes.sistema({ id: componente.sistemas.id })}>
            {truncate(componente.sistemas.nombre)}
          </Link>
        )
      case 'nombre':
        return truncate(componente.nombre)
      case 'descripcion':
        return truncate(componente.descripcion)
      case 'estado':
        return (
          <Chip
            label={componente.estado}
            color={componente.estado === 'ACTIVO' ? 'success' : 'error'}
            size="small"
          />
        )
      case 'entorno':
        return truncate(componente.entorno)
      case 'categoria':
        return truncate(componente.categoria)
      case 'despliegues':
        return (
          <Stack direction="row" spacing={1}>
            {componente.despliegue?.map((d, i) => (
              <Chip
                key={i}
                label={`${d.tipo} / ${d.agrupador}`}
                color="primary"
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        )
      case 'servidores':
        return (
          <Stack direction="row" spacing={1}>
            {componente.despliegue?.map((d, i) => (
              <Chip
                key={i}
                label={d.servidores?.nombre}
                component={Link}
                to={routes.servidor({ id: d.servidores?.id })}
                clickable
                color="secondary"
                size="small"
              />
            ))}
          </Stack>
        )
      case 'fecha_creacion':
        return formatDate(componente.fecha_creacion) // Formatear fecha
      case 'usuario_creacion':
        return usuariosMap[componente.usuario_creacion] || 'N/A' // Mostrar nombre en lugar de ID

      case 'fecha_modificacion':
              return componente.fecha_modificacion
                ? truncate(formatDate(componente.fecha_modificacion))
                : 'N/A'

        case 'usuario_modificacion':
        return usuariosMap[componente.usuario_modificacion] || 'N/A' // Mostrar nombre en lugar de ID
      default:
        return ''
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', boxShadow: 3 }}>
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columnsToDisplay.map(col => (
                  <TableCell key={col.name} sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#1976d2',
                    color: 'white'
                  }}>
                    {col.type === 'checkbox' ? (
                      <Checkbox
                        checked={selectedComponentes.length === filteredComponentes.length}
                        indeterminate={
                          selectedComponentes.length > 0 &&
                          selectedComponentes.length < filteredComponentes.length
                        }
                        onChange={handleSelectAll}
                        sx={{ color: 'white' }}
                      />
                    ) : (
                      <TableSortLabel
                        active={orderBy === col.name}
                        direction={orderBy === col.name ? order : 'asc'}
                        onClick={() => handleSort(col.name)}
                      >
                        {col.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
                <TableCell sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2',
                  color: 'white'
                }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredComponentes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(componente => (
                  <TableRow key={componente.id} hover>
                    {columnsToDisplay.map(col => (
                      <TableCell key={col.name}>
                        {renderCell(componente, col.name)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Ver Detalles">
                          <IconButton
                            size="small"
                            component={Link}
                            to={routes.componente({ id: componente.id })}
                          >
                            <VisibilityIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            component={Link}
                            to={routes.editComponente({ id: componente.id })}
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedId(componente.id)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={filteredComponentes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
        />
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar el componente {selectedId}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => deleteComponente({ variables: { id: selectedId } })}
            variant="contained"
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ComponentesList
