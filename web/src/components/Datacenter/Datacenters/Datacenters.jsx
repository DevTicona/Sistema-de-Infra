import { Link, routes } from '@redwoodjs/router'
import { formatEnum } from 'src/lib/formatters'
import {
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Typography,
  IconButton,
  Avatar,
  Slide,
  Fade,
  styled
} from '@mui/material'
import {
  Edit as EditIcon,
  Storage as ServerIcon,
  LocationOn as LocationIcon,
  Cloud as CloudIcon
} from '@mui/icons-material'

// Componentes simplificados sin theme
const FloatingCard = styled(Card)({
  position: 'relative',
  minHeight: 280,
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 45px rgba(0, 0, 0, 0.2)'
  }
})

const StatusGlow = styled('div')(({ status }) => ({
  position: 'absolute',
  top: -12,
  right: -12,
  width: 24,
  height: 24,
  borderRadius: '50%',
  background: status === 'ACTIVO' ? '#4CAF50' : '#F44336',
  boxShadow: status === 'ACTIVO' ? '0 0 20px #4CAF50' : '0 0 20px #F44336',
  animation: 'pulse 2s infinite'
}))

const HoverAvatar = styled(Avatar)({
  transition: 'transform 0.3s',
  background: 'linear-gradient(45deg, #2196F3 0%, #21CBF3 100%)',
  '&:hover': {
    transform: 'rotate(15deg) scale(1.1)'
  }
})

const DatacentersList = ({ datacenters }) => {
  return (
    <Grid container spacing={4} sx={{ p: 4 }}>
      {datacenters.map((datacenter, index) => (
        <Slide
          key={datacenter.id}
          direction="up"
          in
          timeout={500}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <Grid item xs={12} sm={6} lg={4}>
            <FloatingCard>
              <StatusGlow status={datacenter.estado} />

              <CardContent>
                <HoverAvatar sx={{ width: 64, height: 64, mb: 2 }}>
                  <ServerIcon fontSize="large" />
                </HoverAvatar>

                <Typography variant="h5" gutterBottom sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {datacenter.nombre}
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <Chip
                      icon={<LocationIcon />}
                      label={`Ubicación: ${datacenter.ubicacion}`}
                      variant="outlined"
                      sx={{ width: '100%', borderRadius: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Chip
                      icon={<CloudIcon />}
                      label={`Estado: ${formatEnum(datacenter.estado)}`}
                      color={datacenter.estado === 'ACTIVO' ? 'success' : 'error'}
                      sx={{ width: '100%', borderRadius: 2 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Fade in timeout={800}>
                  <IconButton
                    component={Link}
                    to={routes.editDatacenter({ id: datacenter.id })}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Fade>

                <Chip
                  label="Ver Detalles"
                  component={Link}
                  to={routes.chasis({ id: datacenter.id })}
                  clickable
                  variant="outlined"
                  color="primary"
                />
              </CardActions>
            </FloatingCard>
          </Grid>
        </Slide>
      ))}
    </Grid>
  )
}

export default DatacentersList
