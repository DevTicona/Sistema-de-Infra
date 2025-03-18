import {
  Business,
  Code,
  Info,
  Delete,
  Edit,
  Computer,
  VerifiedUser,
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
  Avatar,
  Box,
} from '@mui/material'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const DELETE_ENTIDAD_MUTATION = gql`
  mutation DeleteEntidadMutation($id: Int!) {
    deleteEntidad(id: $id) {
      id
    }
  }
`

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const Entidad = ({ entidad }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const [deleteEntidad] = useMutation(DELETE_ENTIDAD_MUTATION, {
    onCompleted: () => {
      toast.success('Entidad eliminada')
      navigate(routes.entidads())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleDeleteConfirm = () => {
    deleteEntidad({ variables: { id: entidad.id } })
    setDeleteDialogOpen(false)
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Encabezado */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: '#3f51b5',
              fontSize: '1.5rem',
            }}
          >
            {entidad.nombre?.[0]?.toUpperCase() || 'E'}
          </Avatar>
          <div>
            <Typography
              variant="h4"
              component="h1"
              style={{ fontWeight: 700, color: '#2c3e50' }}
            >
              {entidad.nombre}
            </Typography>
            <Chip
              label={entidad.estado}
              style={{
                marginTop: '0.5rem',
                backgroundColor:
                  entidad.estado === 'ACTIVO' ? '#e8f5e9' : '#ffebee',
                color: entidad.estado === 'ACTIVO' ? '#2e7d32' : '#c62828',
              }}
            />
          </div>
        </Box>
        <div>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Edit />}
            component={Link}
            to={routes.editEntidad({ id: entidad.id })}
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

      <Grid container spacing={3}>
        {/* Columna Izquierda - Información de la Entidad */}
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
                <Business style={{ marginRight: 8 }} /> Información de la
                Entidad
              </Typography>
              <Divider style={{ margin: '1rem 0' }} />

              <Grid container spacing={2}>
                <DetailItem
                  label="ID"
                  value={entidad.id}
                  icon={<Info fontSize="small" />}
                />

                <DetailItem
                  label="Código"
                  value={entidad.codigo}
                  icon={<Code fontSize="small" />}
                />

                <DetailItem
                  label="Sigla"
                  value={entidad.sigla}
                  icon={<VerifiedUser fontSize="small" />}
                />

                <DetailItem
                  label="Historial"
                  value={
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <div>
                        <Typography variant="caption">Creación</Typography>
                        <Typography>
                          {formatDate(entidad.fecha_creacion)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          por: {entidad.usuario_creacion || 'Sistema'}
                        </Typography>
                      </div>
                      {entidad.fecha_modificacion && (
                        <div>
                          <Typography variant="caption">
                            Última modificación
                          </Typography>
                          <Typography>
                            {formatDate(entidad.fecha_modificacion)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            por: {entidad.usuario_modificacion}
                          </Typography>
                        </div>
                      )}
                    </Box>
                  }
                  fullWidth
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna Derecha - Sistemas Asociados */}
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
                <Computer style={{ marginRight: 8 }} /> Sistemas Asociados
              </Typography>
              <Divider style={{ margin: '1rem 0' }} />

              {entidad.sistemas?.length > 0 ? (
                <List dense>
                  {entidad.sistemas.map((sistema) => (
                    <ListItem
                      key={sistema.id}
                      button
                      component={Link}
                      to={routes.sistema({ id: sistema.id })}
                      style={{
                        padding: '12px',
                        margin: '4px 0',
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: '#f8f9fa',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: '#3f51b5',
                          fontSize: '1rem',
                          marginRight: 2,
                        }}
                      >
                        {sistema.nombre?.[0]?.toUpperCase() || 'S'}
                      </Avatar>

                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1" fontWeight={500}>
                              {sistema.nombre || 'Sistema no encontrado'}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              mt: 1,
                            }}
                          >
                            <Chip
                              label={sistema.estado}
                              size="small"
                              sx={{
                                backgroundColor:
                                  sistema.estado === 'ACTIVO'
                                    ? '#e8f5e9'
                                    : '#ffebee',
                                color:
                                  sistema.estado === 'ACTIVO'
                                    ? '#2e7d32'
                                    : '#c62828',
                              }}
                            />
                            <Typography variant="caption" color="textSecondary">
                              Creado el: {formatDate(sistema.fecha_creacion)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 4,
                    gap: 2,
                  }}
                >
                  <Computer sx={{ fontSize: 40, color: '#e0e0e0' }} />
                  <Typography variant="body2" color="textSecondary">
                    No tiene sistemas asociados
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Diálogo de Confirmación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ color: '#c62828', bgcolor: '#fff3e0' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Delete color="error" /> Confirmar Eliminación
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              ¿Eliminar permanentemente la entidad {entidad.nombre}?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Esta acción eliminará todos los registros asociados, incluyendo:
            </Typography>
            <ul style={{ color: '#c62828', margin: '8px 0 0 20px' }}>
              <li>Sistemas asociados</li>
              <li>Historial de actividades</li>
              <li>Configuraciones relacionadas</li>
            </ul>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#fff3e0' }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={{ boxShadow: 'none' }}
          >
            Confirmar Eliminación
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

// Componente DetailItem mejorado
const DetailItem = ({ label, value, icon, fullWidth = false }) => (
  <Grid item xs={12} sm={fullWidth ? 12 : 6}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        p: 1.5,
        bgcolor: '#f8f9fa',
        borderRadius: 1,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{ wordBreak: 'break-word', color: '#2c3e50' }}
      >
        {value || '-'}
      </Typography>
    </Box>
  </Grid>
)

export default Entidad
