import React, { useState } from 'react';
import {
  Menu,
  Close,
  ArrowUpward,
  Business,
  Code,
  Storage,
  People,
  Dashboard,
  Cloud,
  Security,
  Assessment,
  Dns,
  Apps,
  AccountTree,
  GroupWork,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Container,
  Box,
  Fab,
  useScrollTrigger,
  Zoom,
  Grid,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, routes } from '@redwoodjs/router';
import { useAuth } from 'src/auth';
import { keycloak } from 'src/auth';
const HomeLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const trigger = useScrollTrigger({ threshold: 100 });
  const { isAuthenticated, currentUser, logOut, hasRole } = useAuth();
  const isUserAuthenticated = isAuthenticated || !!keycloak?.token
  const sections = [
    {
      title: 'Gestión de Infraestructura',
      icon: <Dns sx={{ color: '#1A337E', mr: 1 }} />,
      items: [
        { name: 'Data Center', route: routes.datacenters(), icon: <Cloud /> },
        { name: 'Servidores', route: routes.servidors(), icon: <Storage /> },
        { name: 'Despliegues', route: routes.despliegues(), icon: <GroupWork /> },
        { name: 'Componentes', route: routes.componentes(), icon: <AccountTree /> },
      ],
    },
    {
      title: 'Gestión de Sistemas',
      icon: <Apps sx={{ color: '#1A337E', mr: 1 }} />,
      items: [
        { name: 'Sistemas', route: routes.sistemas(), icon: <Code /> },
        { name: 'Entidades', route: routes.entidads(), icon: <Business /> },
      ],
    },
    {
      title: 'Gestión de Usuarios',
      icon: <People sx={{ color: '#1A337E', mr: 1 }} />,
      items: [
        { name: 'Usuarios', route: routes.usuarios(), icon: <People /> },
        { name: 'Roles', route: routes.rols(), icon: <Security /> },
        ...(isAuthenticated && hasRole(['admin'])
          ? [{ name: 'User Roles', route: routes.userRols(), icon: <Security /> }]
          : []),
        { name: 'Usuario y Roles', route: routes.usuariorols(), icon: <Security /> },
      ],
    },
    {
      title: 'Reportes',
      icon: <Assessment sx={{ color: '#1A337E', mr: 1 }} />,
      items: [
        { name: 'Reportes Generales', route: routes.reportes(), icon: <Assessment /> },
      ],
    },

  ];

  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const ProfessionalAppBar = styled(AppBar)(({ theme }) => ({
    background: theme.palette.primary.main,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  }));

  const StyledFab = styled(Fab)({
    position: 'fixed',
    zIndex: 1,
    backgroundColor: '#1A337E',
    color: 'white',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 15px rgba(26, 51, 126, 0.3)',
    },
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <ProfessionalAppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)}>
              <Menu sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fff 30%, #90caf9 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', md: 'block' },
            }}
          >
            Unidad de Infraestructura Tecnológica
          </Typography>
          {console.log('Datos de Keycloak:', keycloak?.tokenParsed)}
          {console.log('Esta aut:', isUserAuthenticated)}
          {isUserAuthenticated ? (
            <div>
              <span>
                {currentUser?.email ||
                  keycloak?.tokenParsed?.email ||
                  keycloak?.tokenParsed?.preferred_username ||
                  'Correo no disponible'}
              </span>{' '}
              <button type="button" onClick={keycloak.logout}>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link to={routes.login()}>Iniciar Sesión</Link>
          )}
        </Toolbar>
      </ProfessionalAppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300 } }}
      >
        <Box sx={{ p: 2, background: '#F8FAFF', height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img
                src="/img/icono.jpg"
                alt="Icono AGETIC"
                style={{ height: '200px' }}
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1A337E' }}>
                UIT
              </Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close sx={{ color: '#1A337E' }} />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: 'rgba(26, 51, 126, 0.1)', mb: 2 }} />

          <List>
            <ListItem
              button
              component={Link}
              to={routes.home()}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: '#F0F4FF',
                '&:hover': { transform: 'translateX(5px)' },
              }}
            >
              <Dashboard sx={{ color: '#1A337E', mr: 2 }} />
              <Typography sx={{ fontWeight: 600, color: '#1A337E' }}>Inicio</Typography>
            </ListItem>

            {sections.map((section) => (
              <React.Fragment key={section.title}>
                <Divider sx={{ my: 2, borderColor: 'rgba(26, 51, 126, 0.1)' }} />
                <ListItem
                  button
                  onClick={() => toggleSection(section.title)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#E8F0FE',
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {section.icon}
                    <Typography
                      sx={{
                        ml: 2,
                        fontWeight: 600,
                        color: '#1A337E',
                        flexGrow: 1,
                      }}
                    >
                      {section.title}
                    </Typography>
                    {expandedSections[section.title] ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                </ListItem>
                <Collapse in={expandedSections[section.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {section.items.map((item) => (
                      <ListItem
                        button
                        key={item.name}
                        component={Link}
                        to={item.route}
                        sx={{
                          pl: 4,
                          borderRadius: 2,
                          mb: 1,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#E8F0FE',
                            transform: 'translateX(5px)',
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {React.cloneElement(item.icon, {
                                sx: { color: '#1A337E', fontSize: 20 },
                              })}
                              <Typography
                                sx={{
                                  ml: 2,
                                  fontWeight: 500,
                                  color: '#1A337E',
                                  fontSize: '0.9rem',
                                }}
                              >
                                {item.name}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="xl" sx={{ p: 1, flex: 1 }}>
        <Box
          sx={{
            minHeight: '90vh',
            p: 1,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            background: 'white',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          {children}
        </Box>
      </Container>

      <Zoom in={trigger}>
        <StyledFab
          size="medium"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
        >
          <ArrowUpward />
        </StyledFab>
      </Zoom>

      <Box
        sx={{
          bgcolor: '#1A337E',
          color: 'white',
          mt: 4,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Agencia de Gobierno Electrónico y Tecnologías de Información y Comunicación
              </Typography>
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contacto Institucional
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                Av. Mariscal Santa Cruz, Edificio Agetic
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                +591 2 2377717
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                info@agetic.gob.bo
              </Typography>
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Enlaces importantes
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                Políticas de uso
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                Documentación técnica
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Portal de transparencia
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
            © 2025 AGETIC - Estado Plurinacional de Bolivia
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeLayout;
