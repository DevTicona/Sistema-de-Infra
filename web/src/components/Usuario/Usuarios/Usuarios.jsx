import React, { useState } from 'react';
import { Link, routes } from '@redwoodjs/router';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';
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
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { QUERY } from 'src/components/Usuario/UsuariosCell';
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters';

const DELETE_USUARIO_MUTATION = gql`
  mutation DeleteUsuarioMutation($id: Int!) {
    deleteUsuario(id: $id) {
      id
    }
  }
`;

const UsuariosList = ({ usuarios }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [deleteUsuario] = useMutation(DELETE_USUARIO_MUTATION, {
    onCompleted: () => {
      toast.success('Usuario deleted successfully');
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = [...usuarios].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    return order === 'asc' ? (aValue < bValue ? -1 : 1) : (bValue < aValue ? -1 : 1);
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteUsuario({ variables: { id: selectedId } });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', boxShadow: 3 }}>
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {[ 'Id', 'Uuid Ciudadano', 'Nombre Usuario', 'Profile', 'Teléfono', 'Correo Electrónico', 'Estado', 'Fecha Creación', 'Usuario Creación', 'Fecha Modificación', 'Usuario Modificación' ].map((header, index) => (
                  <TableCell key={index} sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>
                    <TableSortLabel active={orderBy === header.toLowerCase()} direction={orderBy === header.toLowerCase() ? order : 'asc'} onClick={() => handleSort(header.toLowerCase())}>
                      {header}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((usuario) => (
                <TableRow key={usuario.id} hover>
                  <TableCell>{truncate(usuario.id)}</TableCell>
                  <TableCell>{truncate(usuario.uuid_ciudadano)}</TableCell>
                  <TableCell>{truncate(usuario.nombre_usuario)}</TableCell>
                  <TableCell>{jsonTruncate(usuario.profile)}</TableCell>
                  <TableCell>{jsonTruncate(usuario.telefono)}</TableCell>
                  <TableCell>{jsonTruncate(usuario.correo_electronico)}</TableCell>
                  <TableCell>{truncate(usuario.estado)}</TableCell>
                  <TableCell>{timeTag(usuario.fecha_creacion)}</TableCell>
                  <TableCell>{truncate(usuario.usuario_creacion)}</TableCell>
                  <TableCell>{timeTag(usuario.fecha_modificacion)}</TableCell>
                  <TableCell>{truncate(usuario.usuario_modificacion)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Show Details">
                        <IconButton size="small" component={Link} to={routes.usuario({ id: usuario.id })}>
                          <VisibilityIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" component={Link} to={routes.editUsuario({ id: usuario.id })}>
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteClick(usuario.id)}>
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
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={usuarios.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
      </Paper>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete usuario {selectedId}?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsuariosList;
