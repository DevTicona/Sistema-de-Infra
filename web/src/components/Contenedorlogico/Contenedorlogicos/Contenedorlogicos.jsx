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
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { QUERY } from 'src/components/Contenedorlogico/ContenedorlogicosCell';
import { jsonTruncate, timeTag, truncate } from 'src/lib/formatters';

const DELETE_CONTENEDORLOGICO_MUTATION = gql`
  mutation DeleteContenedorlogicoMutation($id: Int!) {
    deleteContenedorlogico(id: $id) {
      id
    }
  }
`;

const ContenedorlogicosList = ({ contenedorlogicos }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [deleteContenedorlogico] = useMutation(DELETE_CONTENEDORLOGICO_MUTATION, {
    onCompleted: () => {
      toast.success('Contenedorlogico deleted successfully');
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

  const sortedData = [...contenedorlogicos].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (order === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return bValue < aValue ? -1 : 1;
    }
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
    deleteContenedorlogico({ variables: { id: selectedId } });
  };

  const headers = [
    { id: 'id', label: 'Id' },
    { id: 'id_padre', label: 'Id Padre' },
    { id: 'codigo', label: 'Código' },
    { id: 'sigla', label: 'Sigla' },
    { id: 'nombre', label: 'Nombre' },
    { id: 'descripcion', label: 'Descripción' },
    { id: 'tipo', label: 'Tipo' },
    { id: 'estado', label: 'Estado' },
    { id: 'respaldo', label: 'Respaldo' },
    { id: 'fecha_creacion', label: 'Fecha Creación' },
    { id: 'usuario_creacion', label: 'Usuario Creación' },
    { id: 'fecha_modificacion', label: 'Fecha Modificación' },
    { id: 'usuario_modificacion', label: 'Usuario Modificación' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{
        width: '100%',
        mb: 2,
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sortDirection={orderBy === header.id ? order : false}
                    style={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === header.id}
                      direction={orderBy === header.id ? order : 'asc'}
                      onClick={() => handleSort(header.id)}
                      style={{
                        color: 'white',
                      }}
                    >
                      {header.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell style={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    style={{
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <TableCell>{truncate(row.id)}</TableCell>
                    <TableCell>{truncate(row.id_padre)}</TableCell>
                    <TableCell>{truncate(row.codigo)}</TableCell>
                    <TableCell>{truncate(row.sigla)}</TableCell>
                    <TableCell>{truncate(row.nombre)}</TableCell>
                    <TableCell>{truncate(row.descripcion)}</TableCell>
                    <TableCell>{truncate(row.tipo)}</TableCell>
                    <TableCell>{truncate(row.estado)}</TableCell>
                    <TableCell>{jsonTruncate(row.respaldo)}</TableCell>
                    <TableCell>{timeTag(row.fecha_creacion)}</TableCell>
                    <TableCell>{truncate(row.usuario_creacion)}</TableCell>
                    <TableCell>{timeTag(row.fecha_modificacion)}</TableCell>
                    <TableCell>{truncate(row.usuario_modificacion)}</TableCell>
                    <TableCell>
                      <Box style={{ display: 'flex', gap: '8px' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            component={Link}
                            to={routes.contenedorlogico({ id: row.id })}
                            style={{ color: '#1976d2' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            component={Link}
                            to={routes.editContenedorlogico({ id: row.id })}
                            style={{ color: '#1976d2' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(row.id)}
                            style={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon fontSize="small" />
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={contenedorlogicos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{
            borderTop: '1px solid #e0e0e0',
          }}
        />
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: {
            borderRadius: '8px',
          }
        }}
      >
        <DialogTitle style={{ backgroundColor: '#1976d2', color: 'white' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent style={{ marginTop: '16px' }}>
          <Typography>
            Are you sure you want to delete contenedorlogico {selectedId}?
          </Typography>
        </DialogContent>
        <DialogActions style={{ padding: '16px' }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            style={{
              color: '#1976d2',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            style={{
              boxShadow: 'none',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContenedorlogicosList;
