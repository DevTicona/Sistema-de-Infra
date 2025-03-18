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

import { QUERY } from 'src/components/Usuario/UsuariosCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'

import { useSearch } from 'src/context/SearchContext'
import { useRefresh } from 'src/context/RefreshContext'
import { TableDataContext } from 'src/context/TableDataContext'
import { ColumnConfigContext } from 'src/context/ColumnConfigContext'

const DELETE_USUARIO_MUTATION = gql`
  mutation DeleteUsuarioMutation($id: Int!) {
    deleteUsuario(id: $id) {
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
const UsuariosList = ({ usuarios }) => {
  // Estados para paginación, orden y selección
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('id')
  const [order, setOrder] = useState('asc')
  const [selectedUsuarios, setSelectedUsuarios] = useState([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  // Contextos para configuración de tabla
  const { setTableData, setTableConfig } = useContext(TableDataContext)
  const { currentTable, setCurrentTableConfig } = useContext(ColumnConfigContext)
  const { search } = useSearch() // Búsqueda global
  const { refresh } = useRefresh()

  // Mutación para eliminar usuario
  const [deleteUsuario] = useMutation(DELETE_USUARIO_MUTATION, {
    onCompleted: () => {
      toast.success('Usuario deleted successfully')
      setDeleteDialogOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  // Filtrado utilizando la búsqueda global
  const filteredData = useMemo(() => {
    const term = (search || '').toLowerCase()
    return usuarios.filter((usuario) => {
      return (
        String(usuario.id).toLowerCase().includes(term) ||
        usuario.uuid_ciudadano?.toLowerCase().includes(term) ||
        usuario.nombre_usuario?.toLowerCase().includes(term) ||
        (usuario.profile &&
          JSON.stringify(usuario.profile).toLowerCase().includes(term)) ||
        (usuario.telefono &&
          JSON.stringify(usuario.telefono).toLowerCase().includes(term)) ||
        (usuario.correo_electronico &&
          JSON.stringify(usuario.correo_electronico).toLowerCase().includes(term)) ||
        usuario.estado?.toLowerCase().includes(term) ||
        (usuario.fecha_creacion &&
          timeTag(usuario.fecha_creacion).toLowerCase().includes(term)) ||
        usuario.usuario_creacion?.toLowerCase().includes(term) ||
        (usuario.fecha_modificacion &&
          timeTag(usuario.fecha_modificacion).toLowerCase().includes(term)) ||
        usuario.usuario_modificacion?.toLowerCase().includes(term)
      )
    })
  }, [usuarios, search])

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
    deleteUsuario({ variables: { id: selectedId } })
  }

  // Configuración de columnas similar a EntidadesList
  const tableName = 'Usuarios'
  const initialColumns = useMemo(
    () => [
      { name: 'checkbox', label: '', visible: true, type: 'checkbox' },
      { name: 'id', label: 'Id', visible: true },
      { name: 'uuid_ciudadano', label: 'Uuid Ciudadano', visible: true },
      { name: 'nombre_usuario', label: 'Nombre Usuario', visible: true },
      { name: 'profile', label: 'Profile', visible: true },
      { name: 'telefono', label: 'Teléfono', visible: true },
      { name: 'correo_electronico', label: 'Correo Electrónico', visible: true },
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

  useEffect(() => {
    setTableData(filteredData)
    setTableConfig({
      tableName,
      filas: selectedUsuarios,
      columns: columnsToDisplay,
    })
  }, [
    filteredData,
    selectedUsuarios,
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
    pageData.every((usuario) => selectedUsuarios.includes(usuario.id))

  const renderCell = (usuario, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <Checkbox
            checked={selectedUsuarios.includes(usuario.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedUsuarios([...selectedUsuarios, usuario.id])
              } else {
                setSelectedUsuarios(
                  selectedUsuarios.filter((id) => id !== usuario.id)
                )
              }
            }}
          />
        )
      case 'id':
        return truncate(usuario.id)
      case 'uuid_ciudadano':
        return truncate(usuario.uuid_ciudadano)
      case 'nombre_usuario':
        return truncate(usuario.nombre_usuario)
      case 'profile':
        return jsonTruncate(usuario.profile)
      case 'telefono':
        return jsonTruncate(usuario.telefono)
      case 'correo_electronico':
        return jsonTruncate(usuario.correo_electronico)
      case 'estado':
        return truncate(usuario.estado)
      case 'fecha_creacion':
        return truncate(formatDate(usuario.fecha_creacion))
      case 'usuario_creacion':
        return truncate(usuario.usuario_creacion)
      case 'fecha_modificacion':
        return truncate(formatDate(usuario.fecha_modificacion))
      case 'usuario_modificacion':
        return truncate(usuario.usuario_modificacion)
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
          {/* Configuración responsive: tableLayout auto y whiteSpace nowrap para que cada celda se ajuste a su contenido */}
          <Table size="small" stickyHeader sx={{ tableLayout: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Checkbox
                    checked={allSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsuarios(pageData.map((e) => e.id))
                      } else {
                        setSelectedUsuarios(
                          selectedUsuarios.filter(
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
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageData.map((usuario) => (
                <TableRow key={usuario.id} hover>
                  {columnsToDisplay.map((col) => (
                    <TableCell key={col.name} sx={{ whiteSpace: 'nowrap', width: 'auto' }}>
                      {renderCell(usuario, col.name)}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Show Details">
                        <IconButton
                          size="small"
                          component={Link}
                          to={routes.usuario({ id: usuario.id })}
                        >
                          <VisibilityIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          component={Link}
                          to={routes.editUsuario({ id: usuario.id })}
                        >
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(usuario.id)}
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
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete usuario {selectedId}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UsuariosList
