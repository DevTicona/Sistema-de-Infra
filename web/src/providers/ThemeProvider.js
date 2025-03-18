// src/providers/ThemeProvider.js
import { createContext, useState, useContext } from 'react'

// Crear el contexto para el tema
const ThemeContext = createContext()

// Proveedor del tema
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light') // Tema inicial: light

  // Función para cambiar entre modo claro y oscuro
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook personalizado para usar el tema
export const useTheme = () => useContext(ThemeContext)
