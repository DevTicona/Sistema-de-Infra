import React, { useState } from 'react'

import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
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
  TextField,
  InputAdornment,
} from '@mui/material'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Entidad/EntidadsCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_ENTIDAD_MUTATION = gql`
  mutation DeleteEntidadMutation($id: Int!) {
    deleteEntidad(id: $id) {
      id
    }
  }
`

const EntidadsList = ({ entidads }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('id')
  const [order, setOrder] = useState('asc')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const filteredData = entidads.filter((entidad) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      entidad.sigla.toLowerCase().includes(searchTermLower) ||
      entidad.nombre.toLowerCase().includes(searchTermLower)
    )
  })

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[orderBy]
    const bValue = b[orderBy]
    return order === 'asc'
      ? aValue < bValue
        ? -1
        : 1
      : bValue < aValue
        ? -1
        : 1
  })

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setPage(0) // Reset to first page when searching
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Paper
          elevation={3}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
            borderRadius: '8px',
          }}
        >
          <TextField
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por sigla o nombre..."
            variant="standard"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              disableUnderline: true,
              sx: { px: 2, py: 1 },
            }}
          />
        </Paper>
      </Box>

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
                {[
                  'ID',
                  'Código',
                  'Sigla',
                  'Nombre',
                  'Estado',
                  'Fecha Creación',
                  'Usuario Creación',
                  'Fecha Modificación',
                  'Usuario Modificación',
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#1976d2',
                      color: 'white',
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === header.toLowerCase()}
                      direction={
                        orderBy === header.toLowerCase() ? order : 'asc'
                      }
                      onClick={() => handleSort(header.toLowerCase())}
                    >
                      {header}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#1976d2',
                    color: 'white',
                  }}
                  align="center"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((entidad) => (
                  <TableRow key={entidad.id} hover>
                    <TableCell>{truncate(entidad.id)}</TableCell>
                    <TableCell>{truncate(entidad.codigo)}</TableCell>
                    <TableCell>{truncate(entidad.sigla)}</TableCell>
                    <TableCell>{truncate(entidad.nombre)}</TableCell>
                    <TableCell>{truncate(entidad.estado)}</TableCell>
                    <TableCell>{timeTag(entidad.fecha_creacion)}</TableCell>
                    <TableCell>{truncate(entidad.usuario_creacion)}</TableCell>
                    <TableCell>{timeTag(entidad.fecha_modificacion)}</TableCell>
                    <TableCell>
                      {truncate(entidad.usuario_modificacion)}
                    </TableCell>
                    <TableCell align="center">
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
          count={filteredData.length}
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
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la entidad {selectedId}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
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

export default EntidadsList
