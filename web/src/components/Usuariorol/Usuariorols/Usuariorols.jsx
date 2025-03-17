import React, { useState, useContext, useMemo, useEffect } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { QUERY } from 'src/components/Usuariorol/UsuariorolsCell'
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
  Checkbox,
  LinearProgress,
} from '@mui/material'
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useSearch } from 'src/context/SearchContext' // Suponiendo que tienes un contexto de búsqueda
import { ColumnConfigContext } from 'src/context/ColumnConfigContext' // Suponiendo que tienes un contexto de configuración de columnas
import { TableDataContext } from 'src/context/TableDataContext' // Suponiendo que tienes un contexto de datos de tabla

const DELETE_USUARIOROL_MUTATION = gql`
  mutation DeleteUsuariorolMutation($id: Int!) {
    deleteUsuariorol(id: $id) {
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

const UsuariorolsList = ({ usuariorols }) => {
  const { search } = useSearch() // Usamos el contexto de búsqueda
  const { setTableData, setTableConfig } = useContext(TableDataContext)
  const { setCurrentTableConfig, currentTable } = useContext(ColumnConfigContext)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedUsuariorols, setSelectedUsuariorols] = useState([])
  const [loading, setLoading] = useState(false)

  const [deleteUsuariorol] = useMutation(DELETE_USUARIOROL_MUTATION, {
    onCompleted: () => {
      toast.success('Usuariorol eliminado correctamente')
      setDeleteDialogOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  // Configuración de columnas
  const tableName = 'Usuariorols'
  const initialColumns = useMemo(
    () => [
      { name: 'checkbox', label: '', visible: true, type: 'checkbox' },
      { name: 'id', label: 'ID', visible: true },
      { name: 'usuario', label: 'Usuario', visible: true },
      { name: 'rol', label: 'Rol', visible: true },
      { name: 'despliegue', label: 'Despliegue', visible: true },
      { name: 'sistema', label: 'Sistema', visible: true },
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
  }, [setCurrentTableConfig, currentTable, initialColumns])

  const columnsToDisplay = currentTable?.tableName === tableName
    ? currentTable.columns.filter(col => col.visible)
    : initialColumns

  // Actualizar contexto de tabla
  useEffect(() => {
    setTableData(usuariorols)
    setTableConfig({
      tableName,
      filas: selectedUsuariorols,
      columns: columnsToDisplay,
    })
  }, [usuariorols, selectedUsuariorols, columnsToDisplay, setTableData, setTableConfig])

  // Manejo de selección
  const handleSelectAll = (event) => {
    setSelectedUsuariorols(event.target.checked ? usuariorols.map(u => u.id) : [])
  }

  const handleSelectOne = (id) => (event) => {
    setSelectedUsuariorols((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((i) => i !== id)
    )
  }

  // Filtrado y búsqueda
  const filteredUsuariorols = useMemo(() => {
    const lowerSearch = search.toLowerCase()
    return usuariorols.filter((usuariorol) =>
      Object.values(usuariorol).some((value) =>
        String(value).toLowerCase().includes(lowerSearch)
      )
    )
  }, [search, usuariorols])

  // Renderizado de celdas
  const renderCell = (usuariorol, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <Checkbox
            checked={selectedUsuariorols.includes(usuariorol.id)}
            onChange={handleSelectOne(usuariorol.id)}
          />
        )
      case 'usuario':
        return truncate(usuariorol.usuarios?.nombre_usuario || 'Sin usuario')
      case 'rol':
        return truncate(usuariorol.roles?.nombre || 'Sin rol')
      case 'despliegue':
        return truncate(usuariorol.despliegue?.nombre || 'Sin despliegue')
      case 'sistema':
        return truncate(usuariorol.sistemas?.nombre || 'Sin sistema')
      case 'estado':
        return (
          <Chip
            label={formatEnum(usuariorol.estado)}
            color={usuariorol.estado === 'ACTIVO' ? 'success' : 'error'}
            size="small"
          />
        )
      case 'fecha_creacion':
        return timeTag(usuariorol.fecha_creacion)
      case 'usuario_creacion':
        return truncate(usuariorol.usuario_creacion)
        case 'fecha_modificacion':
          return new Date(usuariorol[colName]).toLocaleDateString();

      case 'usuario_modificacion':
        return truncate(usuariorol.usuario_modificacion)
      default:
        return truncate(usuariorol[colName])
    }
  }

  // Manejar eliminación
  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteUsuariorol({ variables: { id: selectedId } })
  }

  return (
    <Box sx={{ width: '100%', p: 3, bgcolor: 'background.default' }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
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
                        checked={selectedUsuariorols.length === usuariorols.length}
                        indeterminate={
                          selectedUsuariorols.length > 0 &&
                          selectedUsuariorols.length < usuariorols.length
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
              {filteredUsuariorols.map((usuariorol) => (
                <TableRow key={usuariorol.id} hover>
                  {columnsToDisplay.map((col) => (
                    <TableCell key={col.name}>
                      {renderCell(usuariorol, col.name)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver Detalles">
                        <ActionButton
                          component={Link}
                          to={routes.usuariorol({ id: usuariorol.id })}
                          color="primary"
                        >
                          <VisibilityIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <ActionButton
                          component={Link}
                          to={routes.editUsuariorol({ id: usuariorol.id })}
                          color="secondary"
                        >
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <ActionButton
                          onClick={() => handleDeleteClick(usuariorol.id)}
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
      </Paper>

      {/* Diálogo de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar el usuariorol con ID {selectedId}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UsuariorolsList
