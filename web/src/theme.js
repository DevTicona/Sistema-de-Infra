import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  // Paleta de colores: colores suaves y modernos
  palette: {
    primary: {
      main: '#3f51b5', // Azul intenso
    },
    secondary: {
      main: '#f50057', // Rosa fuerte
    },
    background: {
      default: '#f5f5f5', // Fondo suave y claro
      paper: '#ffffff', // Fondo de los componentes
    },
    text: {
      primary: '#212121', // Color de texto oscuro para contraste
      secondary: '#757575', // Color de texto más claro
    },
    error: {
      main: '#d32f2f', // Rojo para errores
    },
    success: {
      main: '#388e3c', // Verde para éxito
    },
  },

  // Tipografía: fuentes elegantes y modernas
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#333',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#333',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      color: '#333',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      color: '#333',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 300,
      color: '#333',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 300,
      color: '#333',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#212121',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 300,
      color: '#757575',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 300,
      color: '#757575',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: '#212121',
    },
  },

  // Espaciado: control de márgenes y rellenos
  spacing: 8,

  // Componentes personalizados
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Bordes redondeados para los botones
          textTransform: 'none', // No usar mayúsculas en botones
          padding: '8px 16px', // Espaciado cómodo
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Bordes suaves
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave
          padding: '16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#3f51b5', // Barra de navegación con color principal
          color: '#fff', // Texto blanco
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          width: 240, // Ancho del menú lateral
          flexShrink: 0,
        },
        paper: {
          backgroundColor: '#fafafa', // Fondo claro para el menú lateral
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto, sans-serif', // Tipografía global
        },
      },
    },
  },
})

export default theme
