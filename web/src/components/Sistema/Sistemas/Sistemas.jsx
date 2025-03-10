import React, { useState } from 'react'

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
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useSearch } from 'src/context/SearchContext'
const QUERY = gql`
  query SistemasQuery {
    sistemas {
      id
      id_padre
      id_entidad
      codigo
      sigla
      nombre
      descripcion
      estado
      respaldo_creacion
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
      usuario_roles {
        id
        usuarios {
          nombre_usuario
        }
        roles {
          nombre
        }
      }
      entidades {
        id
        nombre
      }
    }
  }
`

const DELETE_SISTEMA_MUTATION = gql`
  mutation DeleteSistemaMutation($id: Int!) {
    deleteSistema(id: $id) {
      id
    }
  }
`
const SistemasList = ({ sistemas }) => {
  const [page] = useState(0)
  const [rowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('id')
  const [order, setOrder] = useState('asc')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const { search } = useSearch() // Obtén el valor de búsqueda desde el contexto

  const [deleteSistema] = useMutation(DELETE_SISTEMA_MUTATION, {
    onCompleted: () => {
      toast.success('Sistema eliminado correctamente')
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

  const sortedData = [...sistemas].sort((a, b) => {
    const aValue = a[orderBy]
    const bValue = b[orderBy]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    return order === 'asc' ? aValue - bValue : bValue - aValue
  })

  const handleDeleteConfirm = () => {
    deleteSistema({ variables: { id: selectedId } })
  }

  const filteredSistemas = sortedData.filter(
    (sistema) =>
      // Filtra por "nombre", "nodo", "ip" y "tipo"
      sistema.nombre?.toLowerCase().includes(search?.toLowerCase() || '') ||
      sistema.codigo?.toLowerCase().includes(search?.toLowerCase() || '') ||
      sistema.sigla?.toLowerCase().includes(search?.toLowerCase() || '')
  )

  return (
    <Box sx={{ width: '100%' }}>
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de querer eliminar este sistema?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Barra de búsqueda */}
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
        ></Paper>
      </Box>

      {/* Tabla principal */}
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
                  'Entidad',
                  'Estado',
                  'Responsables',
                  'Fecha Creación',
                  'Acciones',
                ].map((header) => (
                  <TableCell
                    key={header}
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
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredSistemas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sistema) => (
                  <TableRow key={sistema.id} hover>
                    <TableCell>{sistema.id}</TableCell>
                    <TableCell>{sistema.codigo}</TableCell>
                    <TableCell>{sistema.sigla}</TableCell>
                    <TableCell>{sistema.nombre}</TableCell>
                    <TableCell>
                      {sistema.entidades?.nombre || 'Sin entidad'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={sistema.estado}
                        color={
                          sistema.estado === 'ACTIVO' ? 'success' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {sistema.usuario_roles?.map((ur) => (
                          <Chip
                            key={ur.id}
                            label={`${ur.usuarios?.nombre_usuario} (${ur.roles?.nombre})`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {!sistema.usuario_roles?.length && 'Sin responsables'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(sistema.fecha_creacion).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Ver Detalles">
                          <IconButton
                            component={Link}
                            to={routes.sistema({ id: sistema.id })}
                          >
                            <VisibilityIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            component={Link}
                            to={routes.editSistema({ id: sistema.id })}
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => {
                              setSelectedId(sistema.id)
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
      </Paper>
    </Box>
  )
}

export default SistemasList
