import { Link, routes } from '@redwoodjs/router';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/toast';
import { QUERY } from 'src/components/Entidad/EntidadsCell';
import { timeTag, truncate } from 'src/lib/formatters';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';

const DELETE_ENTIDAD_MUTATION = gql`
  mutation DeleteEntidadMutation($id: Int!) {
    deleteEntidad(id: $id) {
      id
    }
  }
`;

const EntidadsList = ({ entidads }) => {
  const [deleteEntidad] = useMutation(DELETE_ENTIDAD_MUTATION, {
    onCompleted: () => {
      toast.success('Entidad eliminada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });

  const onDeleteClick = (id) => {
    if (confirm(`¿Estás seguro de que deseas eliminar la entidad ${id}?`)) {
      deleteEntidad({ variables: { id } });
    }
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#1976d2', color: 'white' }}>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Código</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Sigla</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Tipo</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Fecha Creación</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Usuario Creación</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Fecha Modificación</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Usuario Modificación</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entidads.map((entidad) => (
            <TableRow key={entidad.id}>
              <TableCell>{truncate(entidad.id)}</TableCell>
              <TableCell>{truncate(entidad.codigo)}</TableCell>
              <TableCell>{truncate(entidad.sigla)}</TableCell>
              <TableCell>{truncate(entidad.nombre)}</TableCell>
              <TableCell>{truncate(entidad.tipo)}</TableCell>
              <TableCell>{truncate(entidad.estado)}</TableCell>
              <TableCell>{timeTag(entidad.fecha_creacion)}</TableCell>
              <TableCell>{truncate(entidad.usuario_creacion)}</TableCell>
              <TableCell>{timeTag(entidad.fecha_modificacion)}</TableCell>
              <TableCell>{truncate(entidad.usuario_modificacion)}</TableCell>
              <TableCell align="center">
                <IconButton component={Link} to={routes.entidad({ id: entidad.id })} color="primary">
                  <Visibility />
                </IconButton>
                <IconButton component={Link} to={routes.editEntidad({ id: entidad.id })} color="secondary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDeleteClick(entidad.id)} color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EntidadsList;
