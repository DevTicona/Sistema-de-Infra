import React, { useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import {
  AppBar, Toolbar, Typography, Button, Drawer, List,
  ListItem, ListItemText, Divider, IconButton, Container,
  Modal, Box, Fab, useScrollTrigger, Zoom, Grid, Avatar
} from '@mui/material'
import {
  Menu, Close, Email, Phone, ArrowUpward,
  Business, Code, Storage, People, Dashboard,
  Cloud, Layers, Security, ContactMail
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const HomeLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const trigger = useScrollTrigger({ threshold: 100 })

  const menuItems = [
    { name: 'Home', route: routes.home(), icon: <Dashboard /> },
    { name: 'Entidades', route: routes.entidads(), icon: <Business /> },
    { name: 'Sistemas', route: routes.sistemas(), icon: <Code /> },
    { name: 'Componentes', route: routes.componentes(), icon: <Storage /> },
    { name: 'Servidores', route: routes.servidors(), icon: <Cloud /> },
    { name: 'Contenedores', route: routes.contenedorlogicos(), icon: <Layers /> },
    { name: 'Usuarios', route: routes.usuarios(), icon: <People /> },
    { name: 'Roles', route: routes.rols(), icon: <Security /> },
  ]

  const GradientAppBar = styled(AppBar)({
    background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)',
  })

  const StyledFab = styled(Fab)({
    position: 'fixed',
    zIndex: 1,
    background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
    color: 'white',
    '&:hover': {
      transform: 'scale(1.1)',
      transition: 'transform 0.3s',
    }
  })

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <GradientAppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)}>
              <Menu />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ ml: 2 }}>
              <Box component="span" sx={{
                fontFamily: 'Monospace',
                fontWeight: 'bold',
                letterSpacing: 4,
                background: 'linear-gradient(45deg, #fff 30%, #90caf9 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                INFRA MANAGER
              </Box>
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ContactMail />}
            onClick={() => setModalOpen(true)}
            sx={{
              borderRadius: 50,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Contacto
          </Button>
        </Toolbar>
      </GradientAppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2, background: '#f5f5f5', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Avatar sx={{
              width: 56,
              height: 56,
              bgcolor: '#1a237e',
              fontSize: 24
            }}>
              IM
            </Avatar>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.name}
                component={Link}
                to={item.route}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': { backgroundColor: '#e8eaf6' }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {item.icon}
                      <Typography sx={{ ml: 2, fontWeight: 500 }}>
                        {item.name}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
          textAlign: 'center'
        }}>
          <ContactMail sx={{ fontSize: 50, color: '#1a237e', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            ¿Necesitas ayuda?
          </Typography>
          <Box sx={{ my: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Email />}
              sx={{ mx: 1, borderRadius: 50 }}
            >
              contact@infra.com
            </Button>
            <Button
              variant="outlined"
              startIcon={<Phone />}
              sx={{ mx: 1, borderRadius: 50 }}
            >
              +1 555 123 456
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={() => setModalOpen(false)}
            sx={{
              background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
              borderRadius: 50,
              px: 4
            }}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>

      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        <Box sx={{
          minHeight: '70vh',
          p: 4,
          borderRadius: 4,
          boxShadow: 3,
          background: 'white'
        }}>
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

      <Box sx={{
        bgcolor: '#1a237e',
        color: 'white',
        mt: 4,
        py: 4
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Infra Manager
              </Typography>
              <Typography variant="body2">
                Soluciones integrales para la gestión de infraestructura tecnológica
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Legal
              </Typography>
              <Typography variant="body2">Términos de uso</Typography>
              <Typography variant="body2">Privacidad</Typography>
              <Typography variant="body2">Licencias</Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recursos
              </Typography>
              <Typography variant="body2">Documentación</Typography>
              <Typography variant="body2">Soporte</Typography>
              <Typography variant="body2">API</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Conecta con nosotros
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Fab size="small" sx={{ bgcolor: 'white', color: '#1a237e' }}>
                  <Typography>X</Typography>
                </Fab>
                <Fab size="small" sx={{ bgcolor: 'white', color: '#1a237e' }}>
                  <Typography>In</Typography>
                </Fab>
                <Fab size="small" sx={{ bgcolor: 'white', color: '#1a237e' }}>
                  <Typography>Fb</Typography>
                </Fab>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            © 2024 Infra Manager. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default HomeLayout
