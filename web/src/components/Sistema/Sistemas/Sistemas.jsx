import React, { useState, useContext, useMemo, useEffect } from 'react';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
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
  Checkbox,
  Stack,
  LinearProgress,
  Snackbar,
  Alert,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Collapse,
} from '@mui/material';

import { Link, routes } from '@redwoodjs/router';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';

import { useSearch } from 'src/context/SearchContext';
import { ColumnConfigContext } from 'src/context/ColumnConfigContext';
import { TableDataContext } from 'src/context/TableDataContext';

// Mutación para eliminar un sistema
const DELETE_SISTEMA_MUTATION = gql`
  mutation DeleteSistemaMutation($id: Int!) {
    deleteSistema(id: $id) {
      id
    }
  }
`;

// Consulta para obtener los sistemas
const QUERY = gql`
  query SistemasQuery {
    sistemas {
      id
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
`;

// Función para obtener valores anidados
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((o, p) => (o || {})[p], obj);
};

const SistemasList = ({ sistemas }) => {
  const { search } = useSearch();
  const { setTableData, setTableConfig } = useContext(TableDataContext);
  const { setCurrentTableConfig, currentTable } = useContext(ColumnConfigContext);

  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSistemas, setSelectedSistemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filters, setFilters] = useState({
    estado: '',
    entidad: '',
    usuario: '', // Cambio aquí para usuario
  });
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const [deleteSistema] = useMutation(DELETE_SISTEMA_MUTATION, {
    onCompleted: () => {
      toast.success('Sistema eliminado correctamente');
      setDeleteDialogOpen(false);
      setSnackbarOpen(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  // Configuración de columnas
  const tableName = 'Sistemas';
  const initialColumns = useMemo(
    () => [
      { name: 'checkbox', label: '', visible: true, type: 'checkbox' },
      { name: 'id', label: 'ID', visible: true },
      { name: 'codigo', label: 'Código', visible: true },
      { name: 'sigla', label: 'Sigla', visible: true },
      { name: 'nombre', label: 'Nombre', visible: true },
      { name: 'descripcion', label: 'Descripción', visible: true },
      { name: 'entidad', label: 'Entidad', visible: true },
      { name: 'estado', label: 'Estado', visible: true },
      { name: 'usuario', label: 'Usuario', visible: true }, // Cambio aquí de "responsable" a "usuario"
      { name: 'respaldo_creacion', label: 'Respaldo Creación', visible: false },
      { name: 'fecha_creacion', label: 'Fecha Creación', visible: true },
      { name: 'usuario_creacion', label: 'Usuario Creación', visible: false },
      { name: 'fecha_modificacion', label: 'Fecha Modificación', visible: false },
      { name: 'usuario_modificacion', label: 'Usuario Modificación', visible: false },
    ],
    []
  );

  useEffect(() => {
    if (!currentTable || currentTable.tableName !== tableName) {
      setCurrentTableConfig({ tableName, columns: initialColumns });
    }
  }, [setCurrentTableConfig, currentTable, initialColumns]);

  const columnsToDisplay = currentTable?.tableName === tableName
    ? currentTable.columns.filter(col => col.visible)
    : initialColumns;

  // Actualizar contexto de tabla
  useEffect(() => {
    setTableData(sistemas);
    setTableConfig({
      tableName,
      filas: selectedSistemas,
      columns: columnsToDisplay,
    });
  }, [sistemas, selectedSistemas, columnsToDisplay, setTableData, setTableConfig]);

  // Manejo de selección
  const handleSelectAll = (event) => {
    setSelectedSistemas(event.target.checked ? sistemas.map(s => s.id) : []);
  };

  const handleSelectOne = (id) => (event) => {
    setSelectedSistemas((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  // Ordenamiento
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filtrado avanzado
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const filteredSistemas = useMemo(() => {
    return sistemas.filter((sistema) => {
      return (
        (filters.estado === '' || sistema.estado === filters.estado) &&
        (filters.entidad === '' || sistema.entidades?.nombre === filters.entidad) &&
        (filters.usuario === '' ||
          sistema.usuario_roles?.some((ur) =>
            ur.usuarios.nombre_usuario.includes(filters.usuario) // Cambio aquí a "usuario"
          ))
      );
    });
  }, [sistemas, filters]);

  // Renderizado de celdas
  const renderCell = (sistema, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <Checkbox
            checked={selectedSistemas.includes(sistema.id)}
            onChange={handleSelectOne(sistema.id)}
          />
        );
      case 'entidad':
        return sistema.entidades?.nombre || 'Sin entidad';
      case 'estado':
        return (
          <Chip
            label={sistema.estado}
            color={sistema.estado === 'ACTIVO' ? 'success' : 'error'}
            size="small"
          />
        );
      case 'usuario': // Cambio aquí para "usuario"
        return sistema.usuario_roles
          ?.map((ur) => ur.usuarios.nombre_usuario)
          ?.join(', ') || 'Sin usuario';
      case 'respaldo_creacion':
        return JSON.stringify(sistema.respaldo_creacion)?.substring(0, 30) + '...';
      case 'fecha_creacion':
      case 'fecha_modificacion':
        return new Date(sistema[colName]).toLocaleDateString();
      default:
        return sistema[colName];
    }
  };

  // Manejar impresión
  const handlePrint = () => {
    console.log('Imprimiendo sistemas seleccionados:', selectedSistemas);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }} className="sistemas-container">
      {/* Filtros avanzados */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<FilterIcon />}
          onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          sx={{ mb: 2 }}
        >
          {filterPanelOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </Button>
        <Collapse in={filterPanelOpen}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="ACTIVO">Activo</MenuItem>
                <MenuItem value="INACTIVO">Inactivo</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Entidad"
              size="small"
              value={filters.entidad}
              onChange={(e) => handleFilterChange('entidad', e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <TextField
              label="Usuario"
              size="small"
              value={filters.usuario}
              onChange={(e) => handleFilterChange('usuario', e.target.value)} // Cambio aquí para "usuario"
              sx={{ minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Collapse>
      </Box>

      {/* Tabla */}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '16px', boxShadow: 3 }}>
        <TableContainer sx={{ maxHeight: '75vh' }}>
          <Table size="small" stickyHeader className="glass-table">
            <TableHead>
              <TableRow>
                {columnsToDisplay.map((col) => (
                  <TableCell
                    key={col.name}
                    sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}
                  >
                    {col.type === 'checkbox' ? (
                      <Checkbox
                        checked={selectedSistemas.length === sistemas.length}
                        indeterminate={
                          selectedSistemas.length > 0 &&
                          selectedSistemas.length < sistemas.length
                        }
                        onChange={handleSelectAll}
                        sx={{ color: 'white' }}
                      />
                    ) : (
                      <TableSortLabel
                        active={orderBy === col.name}
                        direction={orderBy === col.name ? order : 'asc'}
                        onClick={() => handleSort(col.name)}
                      >
                        {col.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredSistemas.map((sistema) => (
                <TableRow key={sistema.id} hover>
                  {columnsToDisplay.map((col) => (
                    <TableCell key={col.name}>
                      {renderCell(sistema, col.name)}
                    </TableCell>
                  ))}
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
                            setSelectedId(sistema.id);
                            setDeleteDialogOpen(true);
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

      {/* Dialogo de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Eliminar Sistema</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este sistema?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => deleteSistema({ variables: { id: selectedId } })}
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de éxito */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Sistema eliminado correctamente
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SistemasList;
