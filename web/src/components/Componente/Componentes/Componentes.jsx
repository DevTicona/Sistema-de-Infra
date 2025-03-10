import React, { useState, useEffect, useContext, useMemo } from 'react'

import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
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
} from '@mui/material'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Componente/ComponentesCell'
import { ColumnConfigContext } from 'src/context/ColumnConfigContext'
import { useRefresh } from 'src/context/RefreshContext'
import { useSearch } from 'src/context/SearchContext'
import { timeTag, truncate } from 'src/lib/formatters'

// Importa el contexto de configuración de columnas

const DELETE_COMPONENTE_MUTATION = gql`
  mutation DeleteComponenteMutation($id: Int!) {
    deleteComponente(id: $id) {
      id
    }
  }
`

const ComponentesList = ({ componentes }) => {
  const { search } = useSearch()
  const { refresh } = useRefresh()

  const [componentesData, setComponentesData] = useState(componentes)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('id')
  const [order, setOrder] = useState('asc')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [deleteComponente] = useMutation(DELETE_COMPONENTE_MUTATION, {
    onCompleted: () => {
      toast.success('Componente deleted successfully')
      setDeleteDialogOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  // Manejo del ordenamiento: se utiliza la propiedad name de la columna para ordenar
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // Ordena los datos; se tiene en cuenta el caso especial para la columna "sistema"
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
      if (aValue < bValue) return order === 'asc' ? -1 : 1
      if (aValue > bValue) return order === 'asc' ? 1 : -1
      return 0
    })
  }, [componentes, order, orderBy])

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
    deleteComponente({ variables: { id: selectedId } })
  }

  useEffect(() => {
    if (refresh) {
      console.log('Tabla refrescada')
      // Aquí podrías refetch los datos si fuera necesario
      setComponentesData([...componentesData])
    }
  }, [componentesData, refresh]) // Se ejecuta cuando refresh cambia

  // Definición de las columnas para la tabla "Componentes"
  const tableName = 'Componentes'
  const initialColumns = useMemo(
    () => [
      { name: 'id', label: 'Id', visible: true },
      { name: 'sistema', label: 'Sistema Asociado', visible: true },
      { name: 'nombre', label: 'Nombre', visible: true },
      { name: 'descripcion', label: 'Descripción', visible: true },
      { name: 'estado', label: 'Estado', visible: true },
      { name: 'entorno', label: 'Entorno', visible: true },
      { name: 'categoria', label: 'Categoría', visible: true },
      { name: 'fecha_creacion', label: 'Fecha Creación', visible: true },
      { name: 'usuario_creacion', label: 'Usuario Creación', visible: false },
      {
        name: 'fecha_modificacion',
        label: 'Fecha Modificación',
        visible: false,
      },
      {
        name: 'usuario_modificacion',
        label: 'Usuario Modificación',
        visible: false,
      },
    ],
    []
  )

  // Uso del contexto para registrar la configuración de columnas para esta tabla
  const { setCurrentTableConfig, currentTable } =
    useContext(ColumnConfigContext)
  useEffect(() => {
    if (!currentTable || currentTable.tableName !== tableName) {
      setCurrentTableConfig({ tableName, columns: initialColumns })
    }
  }, [setCurrentTableConfig, tableName, initialColumns, currentTable])

  // Se toman las columnas que estén marcadas como visibles
  const columnsToDisplay =
    currentTable && currentTable.tableName === tableName
      ? currentTable.columns.filter((col) => col.visible)
      : initialColumns

  // Función para renderizar cada celda de la tabla según el nombre de la columna
  const renderCell = (componente, colName) => {
    switch (colName) {
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
        return truncate(componente.estado)
      case 'entorno':
        return truncate(componente.entorno)
      case 'categoria':
        return truncate(componente.categoria)
      case 'fecha_creacion':
        return timeTag(componente.fecha_creacion)
      case 'usuario_creacion':
        return truncate(componente.usuario_creacion)
      case 'fecha_modificacion':
        return timeTag(componente.fecha_modificacion)
      case 'usuario_modificacion':
        return truncate(componente.usuario_modificacion)
      default:
        return ''
    }
  }

  // Filtrado de datos según el valor de búsqueda (se filtra sobre nombre, sistema, entorno y categoría)
  const filteredComponentes = sortedData.filter(
    (componente) =>
      componente.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      componente.sistemas?.nombre
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      componente.entorno?.toLowerCase().includes(search.toLowerCase()) ||
      componente.categoria?.toLowerCase().includes(search.toLowerCase())
  )

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
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columnsToDisplay.map((col) => (
                  <TableCell
                    key={col.name}
                    sx={{
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
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#1976d2',
                    color: 'white',
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComponentes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((componente) => (
                  <TableRow key={componente.id} hover>
                    {columnsToDisplay.map((col) => (
                      <TableCell key={col.name}>
                        {renderCell(componente, col.name)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            component={Link}
                            to={routes.componente({ id: componente.id })}
                          >
                            <VisibilityIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            component={Link}
                            to={routes.editComponente({ id: componente.id })}
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(componente.id)}
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
          count={componentes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete componente {selectedId}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ComponentesList
