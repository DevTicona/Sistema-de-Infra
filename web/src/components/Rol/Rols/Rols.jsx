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
import { QUERY } from 'src/components/Rol/RolsCell';
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters';

const DELETE_ROL_MUTATION = gql`
  mutation DeleteRolMutation($id: Int!) {
    deleteRol(id: $id) {
      id
    }
  }
`;

const RolsList = ({ rols }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [deleteRol] = useMutation(DELETE_ROL_MUTATION, {
    onCompleted: () => {
      toast.success('Rol deleted successfully');
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

  const sortedData = [...rols].sort((a, b) => {
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
    deleteRol({ variables: { id: selectedId } });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', boxShadow: 3 }}>
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {['Id', 'Nombre', 'Tipo', 'Estado', 'Respaldo', 'Fecha Creación', 'Usuario Creación', 'Fecha Modificación', 'Usuario Modificación'].map((header, index) => (
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
              {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((rol) => (
                <TableRow key={rol.id} hover>
                  <TableCell>{truncate(rol.id)}</TableCell>
                  <TableCell>{truncate(rol.nombre)}</TableCell>
                  <TableCell>{truncate(rol.tipo)}</TableCell>
                  <TableCell>{truncate(rol.estado)}</TableCell>
                  <TableCell>{jsonTruncate(rol.respaldo)}</TableCell>
                  <TableCell>{timeTag(rol.fecha_creacion)}</TableCell>
                  <TableCell>{truncate(rol.usuario_creacion)}</TableCell>
                  <TableCell>{timeTag(rol.fecha_modificacion)}</TableCell>
                  <TableCell>{truncate(rol.usuario_modificacion)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Show Details">
                        <IconButton size="small" component={Link} to={routes.rol({ id: rol.id })}>
                          <VisibilityIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" component={Link} to={routes.editRol({ id: rol.id })}>
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteClick(rol.id)}>
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
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={rols.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
      </Paper>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete rol {selectedId}?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolsList;
