import React, { useState, useContext, useMemo, useEffect } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { QUERY } from 'src/components/Rol/RolsCell'
import { formatEnum, jsonTruncate, timeTag, truncate } from 'src/lib/formatters'
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
import { ColumnConfigContext } from 'src/context/ColumnConfigContext'
import { TableDataContext } from 'src/context/TableDataContext'

const DELETE_ROL_MUTATION = gql`
  mutation DeleteRolMutation($id: Int!) {
    deleteRol(id: $id) {
      id
    }
  }
`

// Estilos personalizados
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

const RolsList = ({ rols }) => {
  const { setTableData, setTableConfig } = useContext(TableDataContext)
  const { setCurrentTableConfig, currentTable } = useContext(ColumnConfigContext)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedRols, setSelectedRols] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Configuración de columnas
  const tableName = 'Rols'
  const initialColumns = useMemo(
    () => [
      { name: 'checkbox', label: '', visible: true, type: 'checkbox' },
      { name: 'id', label: 'ID', visible: true },
      { name: 'nombre', label: 'Nombre', visible: true },
      { name: 'tipo', label: 'Tipo', visible: true },
      { name: 'estado', label: 'Estado', visible: true },
      { name: 'privilegios', label: 'Privilegios', visible: true },
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
  }, [setCurrentTableConfig, currentTable, initialColumns])

  const columnsToDisplay = currentTable?.tableName === tableName
    ? currentTable.columns.filter(col => col.visible)
    : initialColumns

  // Actualizar contexto de tabla
  useEffect(() => {
    setTableData(rols)
    setTableConfig({
      tableName,
      filas: selectedRols,
      columns: columnsToDisplay,
    })
  }, [rols, selectedRols, columnsToDisplay, setTableData, setTableConfig])

  // Manejo de selección
  const handleSelectAll = (event) => {
    setSelectedRols(event.target.checked ? rols.map(r => r.id) : [])
  }

  const handleSelectOne = (id) => (event) => {
    setSelectedRols((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((i) => i !== id)
    )
  }

  // Paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const paginatedRols = rols.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Renderizado de celdas
  const renderCell = (rol, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <Checkbox
            checked={selectedRols.includes(rol.id)}
            onChange={handleSelectOne(rol.id)}
          />
        )
      case 'estado':
        return (
          <Chip
            label={formatEnum(rol.estado)}
            color={rol.estado === 'ACTIVO' ? 'success' : 'error'}
            size="small"
          />
        )
      case 'privilegios':
        return jsonTruncate(rol.privilegios)
      case 'fecha_creacion':
      case 'fecha_modificacion':
        return timeTag(rol[colName])
      default:
        return truncate(rol[colName])
    }
  }

  // Eliminación
  const [deleteRol] = useMutation(DELETE_ROL_MUTATION, {
    onCompleted: () => {
      toast.success('Rol eliminado')
      setDeleteDialogOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteRol({ variables: { id: selectedId } })
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
                        checked={selectedRols.length === rols.length}
                        indeterminate={
                          selectedRols.length > 0 &&
                          selectedRols.length < rols.length
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
              {paginatedRols.map((rol) => (
                <TableRow key={rol.id} hover>
                  {columnsToDisplay.map((col) => (
                    <TableCell key={col.name}>
                      {renderCell(rol, col.name)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver Detalles">
                        <ActionButton
                          component={Link}
                          to={routes.rol({ id: rol.id })}
                          color="primary"
                        >
                          <VisibilityIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <ActionButton
                          component={Link}
                          to={routes.editRol({ id: rol.id })}
                          color="secondary"
                        >
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <ActionButton
                          onClick={() => handleDeleteClick(rol.id)}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rols.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Eliminar rol {selectedId}?</Typography>
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

export default RolsList
