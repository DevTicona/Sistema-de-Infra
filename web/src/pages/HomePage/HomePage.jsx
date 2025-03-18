import {
  Storage,
  Cloud,
  Code,
  People,
  Warning,
  Timeline,
  BarChart,
  Refresh,
} from '@mui/icons-material'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  useTheme,
  Container,
} from '@mui/material'
import {
  LineChart,
  Line,
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { Link, routes } from '@redwoodjs/router'
import { gql, useQuery } from '@redwoodjs/web'

// GraphQL query to fetch statistics
const GET_SYSTEM_STATS = gql`
  query GetSystemStats {
    systemStats {
      sistemas
      servidores
      usuarios
      componentes
    }
    serverStatusData {
      name
      cpu
    }
    deploymentData {
      system
      deployments
    }
    recentDeployments {
      id
      system
      version
      status
    }
    activeAlerts {
      id
      server
      description
    }
  }
`

const HomePage = () => {
  const theme = useTheme()

  // Fetch data using the query
  const { loading, error, data } = useQuery(GET_SYSTEM_STATS)

  // Use real data or fallback to empty values while loading
  const systemStats = data?.systemStats || {
    sistemas: 0,
    servidores: 0,
    usuarios: 0,
    componentes: 0,

  }

  const serverStatusData = data?.serverStatusData || []
  const deploymentData = data?.deploymentData || []
  const recentDeployments = data?.recentDeployments || []
  const activeAlerts = data?.activeAlerts || []

  const InfoCard = ({ icon, title, value, link }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        color: 'white',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'translateY(-5px)' },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" gutterBottom>
          {loading ? "..." : value}
        </Typography>
        {link && (
          <Link to={link} style={{ color: 'white', textDecoration: 'none' }}>
            <Typography variant="body2">Ver detalles →</Typography>
          </Link>
        )}
      </CardContent>
    </Card>
  )

  const SectionHeader = ({ title, icon }) => (
    <Box display="flex" alignItems="center" mb={3}>
      {icon}
      <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold' }}>
        {title}
      </Typography>
    </Box>
  )

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error" variant="h6">Error cargando datos: {error.message}</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header con métricas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <InfoCard
            icon={<Storage fontSize="large" />}
            title="Sistemas Activos"
            value={systemStats.sistemas}
            link={routes.sistemas()}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <InfoCard
            icon={<Cloud fontSize="large" />}
            title="Servidores"
            value={systemStats.servidores}
            link={routes.servidors()}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <InfoCard
            icon={<People fontSize="large" />}
            title="Usuarios"
            value={systemStats.usuarios}
            link={routes.usuarios()}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <InfoCard
            icon={<Cloud fontSize="large" />}
            title="Componentes"
            value={systemStats.componentes}
            link={routes.componentes()}
          />
        </Grid>

      </Grid>

      {/* Gráficos principales */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <SectionHeader
                title="Estado de Servidores"
                icon={<Timeline color="primary" />}
              />
              <IconButton>
                <Refresh />
              </IconButton>
            </Box>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={serverStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2 }}>
            <SectionHeader
              title="Despliegues por Sistema"
              icon={<BarChart color="primary" />}
            />
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={deploymentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="system" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="deployments"
                    fill={theme.palette.secondary.main}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Alertas y Despliegues recientes */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <SectionHeader
              title="Alertas Activas"
              icon={<Warning color="error" />}
            />
            <Box>
              {activeAlerts.map((alert) => (
                <Box
                  key={alert.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: theme.palette.error.light,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography>
                    <strong>{alert.server}</strong>
                  </Typography>
                  <Typography>{alert.description}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <SectionHeader
              title="Despliegues Recientes"
              icon={<Code color="primary" />}
            />
            <Box>
              {recentDeployments.map((deploy) => (
                <Box
                  key={deploy.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: theme.palette.grey[100],
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography>
                    <strong>{deploy.system}</strong> {deploy.version}
                  </Typography>
                  <Typography
                    color={
                      deploy.status === 'Exitoso'
                        ? 'success.main'
                        : deploy.status === 'Fallido'
                          ? 'error.main'
                          : 'warning.main'
                    }
                  >
                    {deploy.status}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default HomePage
