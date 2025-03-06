import {
  People,
  Code,
  Storage,
  Description,
  Delete,
  Edit,
} from '@mui/icons-material'
import {
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const DELETE_SISTEMA_MUTATION = gql`
  mutation DeleteSistemaMutation($id: Int!) {
    deleteSistema(id: $id) {
      id
    }
  }
`

// Helpers personalizados
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatStatus = (status) => {
  const statusMap = {
    ACTIVO: { color: '#4CAF50', text: 'Activo' },
    INACTIVO: { color: '#F44336', text: 'Inactivo' },
  }
  return (
    <span style={{ color: statusMap[status]?.color || '#666' }}>
      {statusMap[status]?.text || status}
    </span>
  )
}

const Sistema = ({ sistema }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const [deleteSistema] = useMutation(DELETE_SISTEMA_MUTATION, {
    onCompleted: () => {
      toast.success('Sistema eliminado correctamente')
      navigate(routes.sistemas())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleDeleteConfirm = () => {
    deleteSistema({ variables: { id: sistema.id } })
    setDeleteDialogOpen(false)
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header con acciones */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          style={{ fontWeight: 700, color: '#2c3e50' }}
        >
          {sistema.nombre}
          <Chip
            label={sistema.estado}
            style={{
              marginLeft: '1rem',
              backgroundColor:
                sistema.estado === 'ACTIVO' ? '#e8f5e9' : '#ffebee',
              color: sistema.estado === 'ACTIVO' ? '#2e7d32' : '#c62828',
            }}
          />
        </Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            component={Link}
            to={routes.editSistema({ id: sistema.id })}
            style={{ marginRight: '1rem' }}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Eliminar
          </Button>
        </div>
      </div>

      {/* Sección principal */}
      <Grid container spacing={3}>
        {/* Columna izquierda - Detalles principales */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} style={{ borderRadius: 16 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#3f51b5',
                }}
              >
                <Description style={{ marginRight: 8 }} /> Información del
                Sistema
              </Typography>

              <Divider style={{ margin: '1rem 0' }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Código
                  </Typography>
                  <Typography variant="body1">{sistema.codigo}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Sigla
                  </Typography>
                  <Typography variant="body1">{sistema.sigla}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Descripción
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {sistema.descripcion || 'Sin descripción'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider style={{ margin: '1.5rem 0' }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Fecha Creación
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(sistema.fecha_creacion)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Última Modificación
                  </Typography>
                  <Typography variant="body2">
                    {sistema.fecha_modificacion
                      ? formatDate(sistema.fecha_modificacion)
                      : 'Nunca modificado'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna derecha - Relaciones */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} style={{ borderRadius: 16, height: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#3f51b5',
                }}
              >
                <People style={{ marginRight: 8 }} /> Responsables
              </Typography>
              <Divider style={{ margin: '1rem 0' }} />

              {sistema.usuario_roles?.length > 0 ? (
                <List dense>
                  {sistema.usuario_roles.map((rol) => (
                    <ListItem key={rol.id} style={{ padding: '8px 0' }}>
                      <ListItemText
                        primary={
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <span style={{ fontWeight: 500 }}>
                              {rol.usuarios?.nombre_usuario}
                            </span>
                            <Chip
                              label={rol.roles?.nombre}
                              size="small"
                              style={{
                                marginLeft: 8,
                                backgroundColor: '#e3f2fd',
                                color: '#1e88e5',
                              }}
                            />
                          </div>
                        }
                        secondary={`Estado: ${formatStatus(rol.estado)} | Asignado el ${formatDate(rol.fecha_creacion)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ textAlign: 'center' }}
                >
                  No hay responsables asignados
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Componentes asociados */}
        <Grid item xs={12}>
          <Card elevation={3} style={{ borderRadius: 16 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#3f51b5',
                }}
              >
                <Code style={{ marginRight: 8 }} /> Componentes
              </Typography>
              <Divider style={{ margin: '1rem 0' }} />

              {sistema.componentes?.length > 0 ? (
                <Grid container spacing={2}>
                  {sistema.componentes.map((componente) => (
                    <Grid item xs={12} sm={6} md={4} key={componente.id}>
                      <Card variant="outlined" style={{ borderRadius: 8 }}>
                        <CardContent style={{ padding: '1rem' }}>
                          <Typography
                            variant="subtitle1"
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Storage
                              style={{
                                fontSize: 18,
                                marginRight: 8,
                                color: '#757575',
                              }}
                            />
                            <Link
                              to={routes.componente({ id: componente.id })}
                              style={{
                                color: '#2c3e50',
                                textDecoration: 'none',
                              }}
                            >
                              {componente.nombre}
                            </Link>
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{ marginTop: 4 }}
                          >
                            Estado: {formatStatus(componente.estado)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ textAlign: 'center' }}
                >
                  No hay componentes asociados
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Diálogo de confirmación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle style={{ color: '#c62828' }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar permanentemente el sistema "
            {sistema.nombre}"?
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginTop: 8 }}
          >
            Esta acción no se puede deshacer y afectará a todos los componentes
            asociados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            startIcon={<Delete />}
          >
            Confirmar Eliminación
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Sistema
