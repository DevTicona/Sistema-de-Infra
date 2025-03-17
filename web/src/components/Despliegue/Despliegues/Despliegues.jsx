import React, { useState, useContext, useMemo, useEffect } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { QUERY } from 'src/components/Despliegue/DesplieguesCell'
import { useSearch } from 'src/context/SearchContext'
import { ColumnConfigContext } from 'src/context/ColumnConfigContext'
import { TableDataContext } from 'src/context/TableDataContext'
import { formatEnum, timeTag, truncate } from 'src/lib/formatters'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  styled,
  TablePagination,
  Checkbox,
  LinearProgress,
} from '@mui/material'
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

const DELETE_DESPLIEGUE_MUTATION = gql`
  mutation DeleteDespliegueMutation($id: Int!) {
    deleteDespliegue(id: $id) {
      id
    }
  }
`

// Estilos personalizados con styled de Material-UI
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  position: 'sticky',
  top: 0,
  zIndex: 1,
}))

const ActionButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
}))

const DesplieguesList = ({ despliegues }) => {
  const { search } = useSearch() // Obtén el valor de búsqueda desde el contexto
  const { setTableData, setTableConfig } = useContext(TableDataContext)
  const { setCurrentTableConfig, currentTable } = useContext(ColumnConfigContext)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedDespliegues, setSelectedDespliegues] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [deleteDespliegue] = useMutation(DELETE_DESPLIEGUE_MUTATION, {
    onCompleted: () => {
      toast.success('Despliegue eliminado correctamente')
      setDeleteDialogOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  // Configuración de columnas
  const tableName = 'Despliegues'
  const initialColumns = useMemo(
    () => [
      { name: 'checkbox', label: '', visible: true, type: 'checkbox' },
      { name: 'id', label: 'ID', visible: true },
      { name: 'agrupador', label: 'Agrupador', visible: true },
      { name: 'nombre', label: 'Nombre', visible: true },
      { name: 'tipo', label: 'Tipo', visible: true },
      { name: 'estado', label: 'Estado', visible: true },

      { name: 'servidor', label: 'Servidor', visible: true },
      { name: 'componente', label: 'Componente', visible: true },

      { name: 'fecha_creacion', label: 'Fecha Creación', visible: true },
      { name: 'usuario_creacion', label: 'Usuario Creación', visible: false },
      { name: 'fecha_modificacion', label: 'Fecha Modificación', visible: false },
      { name: 'usuario_modificacion', label: 'Usuario Modificación', visible: false },

    ],
    []
  )

  useEffect(() => {
    if (!currentTable || currentTable.tableName !== tableName) {
      setCurrentTableConfig({ tableName, columns: initialColumns })
    }
  }, [setCurrentTableConfig, currentTable, initialColumns])

  const columnsToDisplay = currentTable?.tableName === tableName
    ? currentTable.columns.filter(col => col.visible)
    : initialColumns

  // Actualizar contexto de tabla
  useEffect(() => {
    setTableData(despliegues)
    setTableConfig({
      tableName,
      filas: selectedDespliegues,
      columns: columnsToDisplay,
    })
  }, [despliegues, selectedDespliegues, columnsToDisplay, setTableData, setTableConfig])

  // Filtrado
  const filteredDespliegues = useMemo(() => {
    const lowerSearch = search?.toLowerCase() || ''
    return despliegues.filter(
      (despliegue) =>
        despliegue.agrupador?.toLowerCase().includes(lowerSearch) ||
        despliegue.tipo?.toLowerCase().includes(lowerSearch) ||
        despliegue.componentes?.nombre?.toLowerCase().includes(lowerSearch) ||
        despliegue.servidores?.nombre?.toLowerCase().includes(lowerSearch)
    )
  }, [search, despliegues])

  // Paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const paginatedDespliegues = filteredDespliegues.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // Manejo de selección
  const handleSelectAll = (event) => {
    setSelectedDespliegues(event.target.checked ? filteredDespliegues.map(d => d.id) : [])
  }

  const handleSelectOne = (id) => (event) => {
    setSelectedDespliegues((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((i) => i !== id)
    )
  }

  // Renderizado de celdas
  const renderCell = (despliegue, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <Checkbox
            checked={selectedDespliegues.includes(despliegue.id)}
            onChange={handleSelectOne(despliegue.id)}
          />
        )
      case 'estado':
        return (
          <Chip
            label={formatEnum(despliegue.estado)}
            color={despliegue.estado === 'ACTIVO' ? 'success' : 'error'}
            size="small"
          />
        )
      case 'servidor':
        return despliegue.servidores ? (
          <Link to={routes.servidor({ id: despliegue.servidores.id })}>
            {truncate(despliegue.servidores.nombre)}
          </Link>
        ) : (
          'No servidor'
        )
      case 'componente':
        return despliegue.componentes ? (
          <Link to={routes.componente({ id: despliegue.componentes.id })}>
            {truncate(despliegue.componentes.nombre)}
          </Link>
        ) : (
          'No componente'
        )
      case 'usuario':
        return despliegue.usuario_roles?.usuarios
          ? truncate(despliegue.usuario_roles.usuarios.nombre_usuario)
          : 'No usuario'
      case 'rol':
        return despliegue.usuario_roles?.roles
          ? truncate(despliegue.usuario_roles.roles.nombre)
          : 'No Rol'
      default:
        return truncate(despliegue[colName])
    }
  }

  // Manejar eliminación
  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteDespliegue({ variables: { id: selectedId } })
  }

  return (
    <Box sx={{ width: '100%', p: 3, bgcolor: 'background.default' }}>
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: 3,
          bgcolor: 'background.paper',
        }}
      >
        <TableContainer sx={{ maxHeight: '75vh' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columnsToDisplay.map((col) => (
                  <StyledTableCell key={col.name}>
                    {col.type === 'checkbox' ? (
                      <Checkbox
                        checked={selectedDespliegues.length === filteredDespliegues.length}
                        indeterminate={
                          selectedDespliegues.length > 0 &&
                          selectedDespliegues.length < filteredDespliegues.length
                        }
                        onChange={handleSelectAll}
                        sx={{ color: 'white' }}
                      />
                    ) : (
                      col.label
                    )}
                  </StyledTableCell>
                ))}
                <StyledTableCell>Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDespliegues.map((despliegue) => (
                <TableRow key={despliegue.id} hover>
                  {columnsToDisplay.map((col) => (
                    <TableCell key={col.name}>
                      {renderCell(despliegue, col.name)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver Detalles">
                        <ActionButton
                          component={Link}
                          to={routes.despliegue({ id: despliegue.id })}
                          color="primary"
                        >
                          <VisibilityIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <ActionButton
                          component={Link}
                          to={routes.editDespliegue({ id: despliegue.id })}
                          color="secondary"
                        >
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <ActionButton
                          onClick={() => handleDeleteClick(despliegue.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 50, 100]}
          component="div"
          count={filteredDespliegues.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Diálogo de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Eliminar despliegue {selectedId}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DesplieguesList
