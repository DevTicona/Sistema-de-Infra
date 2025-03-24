import React, { useState } from 'react';
import { Head } from '@redwoodjs/web';
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

// Colores institucionales AGETIC
const AGETIC_COLORS = {
  primary: '#8B0000',       // Guindo principal
  secondary: '#D32F2F',     // Guindo claro
  accent: '#FFD700',        // Dorado para acentos
  background: '#FFF5F5',    // Fondo claro
  text: '#4A4A4A',          // Texto principal
  lightText: '#757575',     // Texto secundario
};


const HomeLayout = ({ children }) => {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const trigger = useScrollTrigger({ threshold: 100 });
  const { isAuthenticated, currentUser, logOut, hasRole } = useAuth();
  const isUserAuthenticated = isAuthenticated || !!keycloak?.token;

  const sections = [
    {
      title: 'Gestión de Infraestructura',
      icon: <Dns sx={{ color: AGETIC_COLORS.primary, mr: 1 }} />,
      items: [
        { name: 'Data Center', route: routes.datacenters(), icon: <Cloud /> },
        { name: 'Servidores', route: routes.servidors(), icon: <Storage /> },
        { name: 'Despliegues', route: routes.despliegues(), icon: <GroupWork /> },
        { name: 'Componentes', route: routes.componentes(), icon: <AccountTree /> },
      ],
    },
    {
      title: 'Gestión de Sistemas',
      icon: <Apps sx={{ color: AGETIC_COLORS.primary, mr: 1 }} />,
      items: [
        { name: 'Sistemas', route: routes.sistemas(), icon: <Code /> },
        { name: 'Entidades', route: routes.entidads(), icon: <Business /> },
      ],
    },
    {
      title: 'Gestión de Usuarios',
      icon: <People sx={{ color: AGETIC_COLORS.primary, mr: 1 }} />,
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
      icon: <Assessment sx={{ color: AGETIC_COLORS.primary, mr: 1 }} />,
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
    background: AGETIC_COLORS.primary,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  }));

  const StyledFab = styled(Fab)({
    position: 'fixed',
    zIndex: 1,
    backgroundColor: AGETIC_COLORS.primary,
    color: 'white',
    '&:hover': {
      backgroundColor: AGETIC_COLORS.secondary,
      transform: 'translateY(-5px)',
      boxShadow: `0 8px 15px ${AGETIC_COLORS.primary}30`,
    },
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Head>
      <title>AGETIC</title>
      <link rel="icon" type="icon" href="/img/favicon.ico" />
    </Head>
      <ProfessionalAppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)}>
              <Menu sx={{ fontSize: 32, color: 'white' }} />
            </IconButton>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${AGETIC_COLORS.accent} 30%, ${AGETIC_COLORS.secondary} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', md: 'block' },
              fontFamily: '"Roboto Condensed", sans-serif',
            }}
          >
            Unidad de Infraestructura Tecnológica
          </Typography>

          {isUserAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" sx={{ color: 'white' }}>
                {currentUser?.email ||
                  keycloak?.tokenParsed?.email ||
                  keycloak?.tokenParsed?.preferred_username ||
                  'Usuario AGETIC'}
              </Typography>
              <IconButton
                onClick={keycloak.logout}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: AGETIC_COLORS.secondary
                  }
                }}
              >
                <Close />
              </IconButton>
            </Box>
          ) : (
            <Link
              to={routes.login()}
              sx={{
                color: 'white',
                textDecoration: 'none',
                '&:hover': {
                  color: AGETIC_COLORS.accent
                }
              }}
            >
              Iniciar Sesión
            </Link>
          )}
        </Toolbar>
      </ProfessionalAppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300 } }}
      >
        <Box sx={{ p: 2, background: AGETIC_COLORS.background, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img
                src="/img/logoagetic.png"  // Asegurar tener este logo en público
                alt="Logo AGETIC"
                style={{ height: '80px' }}
              />
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close sx={{ color: AGETIC_COLORS.primary }} />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: `${AGETIC_COLORS.primary}20`, mb: 2 }} />

          <List>
            <ListItem
              button
              component={Link}
              to={routes.home()}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: `${AGETIC_COLORS.primary}10`,
                '&:hover': {
                  transform: 'translateX(5px)',
                  backgroundColor: `${AGETIC_COLORS.primary}20`
                },
              }}
            >
              <Dashboard sx={{ color: AGETIC_COLORS.primary, mr: 2 }} />
              <Typography sx={{ fontWeight: 600, color: AGETIC_COLORS.text }}>Inicio</Typography>
            </ListItem>

            {sections.map((section) => (
              <React.Fragment key={section.title}>
                <Divider sx={{ my: 2, borderColor: `${AGETIC_COLORS.primary}10` }} />
                <ListItem
                  button
                  onClick={() => toggleSection(section.title)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: `${AGETIC_COLORS.primary}10`,
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
                        color: AGETIC_COLORS.text,
                        flexGrow: 1,
                      }}
                    >
                      {section.title}
                    </Typography>
                    {expandedSections[section.title] ?
                      <ExpandLess sx={{ color: AGETIC_COLORS.primary }} /> :
                      <ExpandMore sx={{ color: AGETIC_COLORS.primary }} />}
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
                            backgroundColor: `${AGETIC_COLORS.primary}10`,
                            transform: 'translateX(5px)',
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {React.cloneElement(item.icon, {
                                sx: { color: AGETIC_COLORS.primary, fontSize: 20 },
                              })}
                              <Typography
                                sx={{
                                  ml: 2,
                                  fontWeight: 500,
                                  color: AGETIC_COLORS.text,
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
            p: 3,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            background: 'white',
            border: `1px solid ${AGETIC_COLORS.primary}20`,
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
          bgcolor: AGETIC_COLORS.primary,
          color: 'white',
          mt: 4,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <img
                src="/img/logo-agetic-blanco.png"
                alt="AGETIC"
                style={{ height: '80px', marginBottom: '1rem' }}
              />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Agencia de Gobierno Electrónico y Tecnologías de Información y Comunicación
              </Typography>
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: AGETIC_COLORS.accent }}>
                Contacto Institucional
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                Sopocachi Calle Pedro Salazar N° 631<br />
                Edificio FNDR Pisos 3, 4 y 5<br />
                La Paz - Bolivia
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                Teléfono: (+591 2) 2184026
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
              Celular (Solo mensajes por WhatsApp):
              63195237 – WhatsApp Soporte Técnico
              63124081 – WhatsApp Soporte Técnico únicamente para Ciudadanía Digital
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Correo: soporte@agetic.gob.bo
              </Typography>
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: AGETIC_COLORS.accent }}>
                Enlaces importantes
              </Typography>
              <Link href="#" sx={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9, '&:hover': { color: AGETIC_COLORS.accent } }}>
                  Políticas de uso
                </Typography>
              </Link>
              <Link href="#" sx={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9, '&:hover': { color: AGETIC_COLORS.accent } }}>
                  Documentación técnica
                </Typography>
              </Link>
              <Link href="#" sx={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" sx={{ opacity: 0.9, '&:hover': { color: AGETIC_COLORS.accent } }}>
                  Portal de transparencia
                </Typography>
              </Link>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: `${AGETIC_COLORS.accent}20` }} />
          <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} AGETIC - Gobierno del Estado Plurinacional de Bolivia
          </Typography>
        </Container>
      </Box>

    </Box>

  );

};

export default HomeLayout;

