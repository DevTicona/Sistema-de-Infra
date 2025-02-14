
import { Link, routes } from '@redwoodjs/router'
import {
  Box, Grid, Typography, Card, CardContent,
  LinearProgress, IconButton, useTheme, Container
} from '@mui/material'


import {
  Storage, Cloud, Code, People,
  Warning, Timeline, BarChart, Refresh
} from '@mui/icons-material'
import { LineChart, Line, Bar, BarChart as RechartsBarChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const HomePage = () => {
  const theme = useTheme()

  // Datos de ejemplo (deberías conectar con tu API)
  const systemStats = {
    sistemas: 12,
    servidores: 45,
    contenedores: 128,
    usuarios: 23,
    alertas: 3
  }

  const serverStatusData = [
    { name: 'Servidor 1', cpu: 65 },
    { name: 'Servidor 2', cpu: 45 },
    { name: 'Servidor 3', cpu: 85 },
    { name: 'Servidor 4', cpu: 30 },
  ]

  const deploymentData = [
    { system: 'ERP', deployments: 14 },
    { system: 'CRM', deployments: 8 },
    { system: 'BI', deployments: 5 },
    { system: 'HR', deployments: 11 },
  ]

  const recentDeployments = [
    { id: 1, system: 'ERP', version: '2.3.1', status: 'Exitoso' },
    { id: 2, system: 'CRM', version: '1.0.5', status: 'Fallido' },
    { id: 3, system: 'BI', version: '3.1.0', status: 'En progreso' },
  ]

  const activeAlerts = [
    { id: 1, server: 'SRV-01', description: 'Alto uso de CPU' },
    { id: 2, server: 'SRV-05', description: 'Memoria baja' },
    { id: 3, server: 'CON-12', description: 'Contenedor inactivo' },
  ]

  const InfoCard = ({ icon, title, value, link }) => (
    <Card sx={{
      height: '100%',
      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
      color: 'white',
      transition: 'transform 0.3s',
      '&:hover': { transform: 'translateY(-5px)' }
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
        </Box>
        <Typography variant="h4" component="div" gutterBottom>
          {value}
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
            icon={<Code fontSize="large" />}
            title="Contenedores"
            value={systemStats.contenedores}
            link={routes.contenedorlogicos()}
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
      </Grid>

      {/* Gráficos principales */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
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
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography><strong>{alert.server}</strong></Typography>
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
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography><strong>{deploy.system}</strong> v{deploy.version}</Typography>
                  <Typography color={
                    deploy.status === 'Exitoso' ? 'success.main' :
                    deploy.status === 'Fallido' ? 'error.main' : 'warning.main'
                  }>
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
