import {
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Button,
  Avatar,
  Paper,
  Box,
  Divider,

} from '@mui/material'
import {
  Lock,
  Person,
  Computer,
  Group,
  CalendarToday,
  Update,
  Edit,
  Delete,
  Link as LinkIcon,
} from '@mui/icons-material'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const DELETE_USUARIOROL_MUTATION = gql`
  mutation DeleteUsuariorolMutation($id: Int!) {
    deleteUsuariorol(id: $id) {
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

const Usuariorol = ({ usuariorol }) => {
  const [deleteUsuariorol] = useMutation(DELETE_USUARIOROL_MUTATION, {
    onCompleted: () => {
      toast.success('Asignación eliminada')
      navigate(routes.usuariorols())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm(`¿Eliminar la asignación ${id} permanentemente?`)) {
      deleteUsuariorol({ variables: { id } })
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#3f51b5', width: 56, height: 56 }}>
            <Lock fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Asignación #{usuariorol.id}
            </Typography>
            <Chip
              label={usuariorol.estado}
              sx={{
                mt: 1,
                backgroundColor:
                  usuariorol.estado === 'ACTIVO' ? '#e8f5e9' : '#ffebee',
                color:
                  usuariorol.estado === 'ACTIVO' ? '#2e7d32' : '#c62828',
              }}
            />
          </Box>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Edit />}
            component={Link}
            to={routes.editUsuariorol({ id: usuariorol.id })}
            sx={{ mr: 2 }}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => onDeleteClick(usuariorol.id)}
          >
            Eliminar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Sección 1: Información Principal */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
                <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
                Detalles de la Asignación
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <DetailItem
                  icon={<CalendarToday fontSize="small" />}
                  label="Fecha de creación"
                  value={
                    <>
                      {formatDate(usuariorol.fecha_creacion)}
                      <Typography variant="caption" display="block">
                        Por: {usuariorol.usuario_creacion || 'Sistema'}
                      </Typography>
                    </>
                  }
                />

                <DetailItem
                  icon={<Update fontSize="small" />}
                  label="Última modificación"
                  value={
                    usuariorol.fecha_modificacion ? (
                      <>
                        {formatDate(usuariorol.fecha_modificacion)}
                        <Typography variant="caption" display="block">
                          Por: {usuariorol.usuario_modificacion}
                        </Typography>
                      </>
                    ) : (
                      'Sin modificaciones'
                    )
                  }
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sección 2: Entidades Relacionadas */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
                <LinkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Elementos Asociados
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {/* Rol */}
                <Grid item xs={12} sm={6}>
                  <EntityCard
                    title="Rol Asignado"
                    entity={usuariorol.roles}
                    icon={<Lock />}
                    link={routes.rol({ id: usuariorol.roles?.id })}
                  />
                </Grid>

                {/* Usuario */}
                <Grid item xs={12} sm={6}>
                  <EntityCard
                    title="Usuario"
                    entity={usuariorol.usuarios}
                    icon={<Person />}
                    link={routes.usuario({ id: usuariorol.usuarios?.id })}
                    subtitle={usuariorol.usuarios?.nombre_usuario}
                  />
                </Grid>

                {/* Sistema */}
                <Grid item xs={12} sm={6}>
                  <EntityCard
                    title="Sistema"
                    entity={usuariorol.sistemas}
                    icon={<Computer />}
                    link={routes.sistema({ id: usuariorol.sistemas?.id })}
                  />
                </Grid>

                {/* Despliegue */}
                <Grid item xs={12} sm={6}>
                  <EntityCard
                    title="Despliegue"
                    entity={usuariorol.despliegue}
                    icon={<LinkIcon />}
                    link={routes.despliegue({ id: usuariorol.despliegue?.id })}
                    subtitle={`Agrupador: ${usuariorol.despliegue?.agrupador}`}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

// Componentes auxiliares
const DetailItem = ({ icon, label, value }) => (
  <Grid item xs={12} sm={6}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
      <Avatar sx={{ bgcolor: '#e3f2fd', width: 32, height: 32 }}>{icon}</Avatar>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  </Grid>
)

const EntityCard = ({ title, entity, icon, link, subtitle }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      height: '100%',
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: '#f8f9fa',
        borderColor: '#3f51b5',
      },
    }}
    component={Link}
    to={link}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: '#e3f2fd', color: '#3f51b5' }}>{icon}</Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight={500}>
          {entity?.nombre || title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
        {entity?.estado && (
          <Chip
            label={entity.estado}
            size="small"
            sx={{
              mt: 1,
              backgroundColor:
                entity.estado === 'ACTIVO' ? '#e8f5e9' : '#ffebee',
              color: entity.estado === 'ACTIVO' ? '#2e7d32' : '#c62828',
            }}
          />
        )}
      </Box>
    </Box>
  </Paper>
)

export default Usuariorol
