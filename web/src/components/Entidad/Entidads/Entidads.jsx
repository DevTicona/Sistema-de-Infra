import React, { useContext, useEffect, useMemo, useState } from 'react'

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
} from '@mui/material'

import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Entidad/EntidadsCell'
import { timeTag, truncate, formatEnum } from 'src/lib/formatters'

import { ColumnConfigContext } from 'src/context/ColumnConfigContext'
import { useRefresh } from 'src/context/RefreshContext'
import { useSearch } from 'src/context/SearchContext'
import { TableDataContext } from 'src/context/TableDataContext'

const DELETE_ENTIDAD_MUTATION = gql`
  mutation DeleteEntidadMutation($id: Int!) {
    deleteEntidad(id: $id) {
      id
    }
  }
`

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const EntidadsList = ({ entidads }) => {
  // Estados para paginación, orden y selección
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('id')
  const [order, setOrder] = useState('asc')
  const [selectedEntidades, setSelectedEntidades] = useState([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  // Contextos para configuración y datos de tabla
  const { setTableData, setTableConfig } = useContext(TableDataContext)
  const { currentTable, setCurrentTableConfig } =
    useContext(ColumnConfigContext)
  const { search } = useSearch() // Únicamente se usa búsqueda global
  const { refresh } = useRefresh()

  // Mutación para eliminar entidad
  const [deleteEntidad] = useMutation(DELETE_ENTIDAD_MUTATION, {
    onCompleted: () => {
      toast.success('Entidad eliminada correctamente')
      setDeleteDialogOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  // Filtrado basado en la búsqueda global
  const filteredData = useMemo(() => {
    const term = (search || '').toLowerCase()
    return entidads.filter((entidad) => {
      return (
        String(entidad.id).toLowerCase().includes(term) ||
        entidad.codigo?.toLowerCase().includes(term) ||
        entidad.sigla?.toLowerCase().includes(term) ||
        entidad.nombre?.toLowerCase().includes(term) ||
        entidad.estado?.toLowerCase().includes(term)
      )
    })
  }, [entidads, search])

  // Ordenamiento
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy]
      const bValue = b[orderBy]
      if (aValue == null) return 1
      if (bValue == null) return -1
      return order === 'asc'
        ? aValue < bValue
          ? -1
          : 1
        : aValue < bValue
          ? 1
          : -1
    })
  }, [filteredData, order, orderBy])

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setDeleteDialogOpen(true)
  }
  const handleDeleteConfirm = () => {
    deleteEntidad({ variables: { id: selectedId } })
  }

  // Configuración de columnas para integrar con contextos
  const tableName = 'Entidads'
  const initialColumns = useMemo(
    () => [
      { name: 'checkbox', label: '', visible: true, type: 'checkbox' },
      { name: 'id', label: 'ID', visible: true },
      { name: 'codigo', label: 'Código', visible: true },
      { name: 'sigla', label: 'Sigla', visible: true },
      { name: 'nombre', label: 'Nombre', visible: true },
      { name: 'estado', label: 'Estado', visible: true },
      { name: 'fecha_creacion', label: 'Fecha Creación', visible: true },
      { name: 'usuario_creacion', label: 'Usuario Creación', visible: true },
      { name: 'fecha_modificacion', label: 'Fecha Modificación', visible: true },
      { name: 'usuario_modificacion', label: 'Usuario Modificación', visible: true },
    ],
    []
  )

  useEffect(() => {
    if (!currentTable || currentTable.tableName !== tableName) {
      setCurrentTableConfig({ tableName, columns: initialColumns })
    }
  }, [currentTable, setCurrentTableConfig, initialColumns, tableName])

  const columnsToDisplay =
    currentTable && currentTable.tableName === tableName
      ? currentTable.columns.filter((col) => col.visible)
      : initialColumns

  // Actualizar datos y configuración de la tabla en los contextos
  useEffect(() => {
    setTableData(filteredData)
    setTableConfig({
      tableName,
      filas: selectedEntidades,
      columns: columnsToDisplay,
    })
  }, [
    filteredData,
    selectedEntidades,
    columnsToDisplay,
    setTableData,
    setTableConfig,
    tableName,
  ])

  // Selección de filas: datos en la página actual
  const pageData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )
  const allSelected =
    pageData.length > 0 &&
    pageData.every((entidad) => selectedEntidades.includes(entidad.id))

  // Función para renderizar el contenido de cada celda; se establece "width: auto" y "whiteSpace: nowrap"
  const renderCell = (entidad, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <Checkbox
            checked={selectedEntidades.includes(entidad.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedEntidades([...selectedEntidades, entidad.id])
              } else {
                setSelectedEntidades(
                  selectedEntidades.filter((id) => id !== entidad.id)
                )
              }
            }}
          />
        )
      case 'id':
        return truncate(entidad.id)
      case 'codigo':
        return truncate(entidad.codigo)
      case 'sigla':
        return truncate(entidad.sigla)
      case 'nombre':
        return truncate(entidad.nombre)
      case 'estado':
        return formatEnum(entidad.estado)
      case 'fecha_creacion':
        return truncate(formatDate(entidad.fecha_creacion))
      case 'usuario_creacion':
        return truncate(entidad.usuario_creacion)
      case 'fecha_modificacion':
        return truncate(formatDate(entidad.fecha_modificacion))
      case 'usuario_modificacion':
        return truncate(entidad.usuario_modificacion)
      default:
        return ''
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: 3,
        }}
      >
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          {/* Se establece tableLayout: 'auto' para que el ancho de las columnas dependa del contenido */}
          <Table size="small" stickyHeader sx={{ tableLayout: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Checkbox
                    checked={allSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEntidades(pageData.map((e) => e.id))
                      } else {
                        setSelectedEntidades(
                          selectedEntidades.filter(
                            (id) => !pageData.some((e) => e.id === id)
                          )
                        )
                      }
                    }}
                  />
                </TableCell>
                {columnsToDisplay
                  .filter((col) => col.name !== 'checkbox')
                  .map((col) => (
                    <TableCell
                      key={col.name}
                      sx={{
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                        backgroundColor: '#1976d2',
                        color: 'white',
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === col.name}
                        direction={orderBy === col.name ? order : 'asc'}
                        onClick={() => handleSort(col.name)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                <TableCell
                  align="center"
                  sx={{
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    backgroundColor: '#1976d2',
                    color: 'white',
                  }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageData.map((entidad) => (
                <TableRow key={entidad.id} hover>
                  {columnsToDisplay.map((col) => (
                    <TableCell key={col.name} sx={{ whiteSpace: 'nowrap', width: 'auto' }}>
                      {renderCell(entidad, col.name)}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver Detalles">
                        <IconButton
                          size="small"
                          component={Link}
                          to={routes.entidad({ id: entidad.id })}
                        >
                          <VisibilityIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          component={Link}
                          to={routes.editEntidad({ id: entidad.id })}
                        >
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(entidad.id)}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la entidad {selectedId}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EntidadsList
