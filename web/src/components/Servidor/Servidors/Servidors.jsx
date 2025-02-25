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

import { QUERY } from 'src/components/Servidor/ServidorsCell'
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters'
import {
  tableCellStyle,
  paperStyle,
  tableCellActionsStyle,
} from 'src/utils/ServidorStyles' // Import styles here

const DELETE_SERVIDOR_MUTATION = gql`
  mutation DeleteServidorMutation($id: Int!) {
    deleteServidor(id: $id) {
      id
    }
  }
`

const ServidorsList = ({ servidors }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('id')
  const [order, setOrder] = useState('asc')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const [deleteServidor] = useMutation(DELETE_SERVIDOR_MUTATION, {
    onCompleted: () => {
      toast.success('Servidor deleted successfully')
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

  const sortedData = [...servidors].sort((a, b) => {
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
    deleteServidor({ variables: { id: selectedId } })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={paperStyle}>
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  'Id',
                  'Nro Cluster',
                  'VMID',
                  'Nombre',
                  'Nodo',
                  'IP',
                  'Tipo',
                  'Estado',
                  'Metadata',
                  'Fecha Creación',
                  'Usuario Creación',
                  'Fecha Modificación',
                  'Usuario Modificación',
                  'id cuchilla',
                ].map((header, index) => (
                  <TableCell key={index} sx={tableCellStyle}>
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
                <TableCell sx={tableCellActionsStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((servidor) => (
                  <TableRow
                    key={servidor.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    component={Link}
                    to={routes.servidorDetalle({ id: servidor.id })} // Asegúrate que esta ruta esté correctamente configurada en routes.js
                  >
                    <TableCell>{truncate(servidor.id)}</TableCell>
                    <TableCell>{truncate(servidor.nro_cluster)}</TableCell>
                    <TableCell>{truncate(servidor.vmid)}</TableCell>
                    <TableCell>{truncate(servidor.nombre)}</TableCell>
                    <TableCell>{truncate(servidor.nodo)}</TableCell>
                    <TableCell>{truncate(servidor.ip)}</TableCell>
                    <TableCell>{truncate(servidor.tipo)}</TableCell>
                    <TableCell>{truncate(servidor.estado)}</TableCell>
                    <TableCell>{jsonTruncate(servidor.metadata)}</TableCell>
                    <TableCell>{timeTag(servidor.fecha_creacion)}</TableCell>
                    <TableCell>{truncate(servidor.usuario_creacion)}</TableCell>
                    <TableCell>
                      {timeTag(servidor.fecha_modificacion)}
                    </TableCell>
                    <TableCell>
                      {truncate(servidor.usuario_modificacion)}
                    </TableCell>
                    <TableCell>{truncate(servidor.id_cuchilla)}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', gap: 1 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tooltip title="Show Details">
                          <IconButton
                            size="small"
                            component={Link}
                            to={routes.servidor({ id: servidor.id })}
                          >
                            <VisibilityIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            component={Link}
                            to={routes.editServidor({ id: servidor.id })}
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClick(servidor.id)
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={servidors.length}
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
            Are you sure you want to delete servidor {selectedId}?
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

export default ServidorsList
