import { Link, routes } from '@redwoodjs/router';
import { Button, Typography, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// Botón estilizado con Material-UI
const StyledButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: 'white',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  textTransform: 'none',
  '&:hover': {
    background: theme.palette.primary.dark,
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
  '&:active': {
    background: theme.palette.primary.light,
  },
  transition: 'all 0.3s ease',
}));

const ReportesPage = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1A337E' }}>
          Sección de Reportes
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mt: 2 }}>
          Elige el reporte que deseas consultar.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <StyledButton
          component={Link}
          to={routes.servidors()}
          sx={{ width: '300px' }}
        >
          Reporte de Servidores
        </StyledButton>

        <StyledButton
          component={Link}
          to={routes.sistemas()}
          sx={{ width: '300px' }}
        >
          Reporte de Sistemas
        </StyledButton>

        <StyledButton
          component={Link}
          to={routes.usuariorols()}
          sx={{ width: '300px' }}
        >
          Reporte de Usuario Roles
        </StyledButton>
        <StyledButton
          component={Link}
          to={routes.despliegues()}
          sx={{ width: '300px' }}
        >
          Reporte de despliegues
        </StyledButton>
      </Box>
    </Container>
  );
};

export default ReportesPage;
