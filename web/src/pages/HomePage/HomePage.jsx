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

// Colores institucionales AGETIC
const AGETIC_COLORS = {
  primary: '#8B0000',       // Guindo principal
  secondary: '#D32F2F',     // Guindo claro
  accent: '#FFD700',        // Dorado para acentos
  background: '#FFF5F5',    // Fondo claro
  text: '#4A4A4A',          // Texto principal
  lightText: '#757575',     // Texto secundario
};

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
        background: `linear-gradient(45deg, ${AGETIC_COLORS.primary} 30%, ${AGETIC_COLORS.secondary} 90%)`,
        color: 'white',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'translateY(-5px)' },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {React.cloneElement(icon, { sx: { color: AGETIC_COLORS.accent } })}
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
      {React.cloneElement(icon, { sx: { color: AGETIC_COLORS.primary } })}
      <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold', color: AGETIC_COLORS.text }}>
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
          <Card sx={{ p: 2, background: AGETIC_COLORS.background }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <SectionHeader
                title="Estado de Servidores"
                icon={<Timeline />}
              />
              <IconButton>
                <Refresh sx={{ color: AGETIC_COLORS.primary }} />
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
                    stroke={AGETIC_COLORS.primary}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2, background: AGETIC_COLORS.background }}>
            <SectionHeader
              title="Despliegues por Sistema"
              icon={<BarChart />}
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
                    fill={AGETIC_COLORS.accent}
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
          <Card sx={{ p: 2, background: AGETIC_COLORS.background }}>
            <SectionHeader
              title="Alertas Activas"
              icon={<Warning sx={{ color: AGETIC_COLORS.secondary }} />}
            />
            <Box>
              {activeAlerts.map((alert) => (
                <Box
                  key={alert.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: AGETIC_COLORS.background,
                    border: `1px solid ${AGETIC_COLORS.secondary}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography sx={{ color: AGETIC_COLORS.text }}>
                    <strong>{alert.server}</strong>
                  </Typography>
                  <Typography sx={{ color: AGETIC_COLORS.text }}>
                    {alert.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, background: AGETIC_COLORS.background }}>
            <SectionHeader
              title="Despliegues Recientes"
              icon={<Code />}
            />
            <Box>
              {recentDeployments.map((deploy) => (
                <Box
                  key={deploy.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: AGETIC_COLORS.background,
                    border: `1px solid ${AGETIC_COLORS.primary}20`,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography sx={{ color: AGETIC_COLORS.text }}>
                    <strong>{deploy.system}</strong> {deploy.version}
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        deploy.status === 'Exitoso'
                          ? AGETIC_COLORS.primary
                          : deploy.status === 'Fallido'
                            ? AGETIC_COLORS.secondary
                            : AGETIC_COLORS.accent,
                    }}
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
