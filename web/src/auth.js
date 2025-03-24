import Keycloak from 'keycloak-js'
import { createDbAuthClient, createAuth } from '@redwoodjs/auth-dbauth-web'

// Configuración de Keycloak
const keycloak = new Keycloak({
  url: 'https://auth-uit.agetic.gob.bo/', // Cambia esta URL con tu servidor Keycloak
  realm: 'ciudadaniadigital', // Cambia esto por tu realm de Keycloak
  clientId: 'redwood-app', // Cambia esto por el client ID que configuraste en Keycloak
})

// Crear el cliente de dbAuth
const dbAuthClient = createDbAuthClient()

// Combinación de dbAuth y Keycloak para usar el mismo AuthProvider
const { AuthProvider, useAuth } = createAuth(dbAuthClient)

// Función para inicializar Keycloak
export const initKeycloak = (onAuthenticatedCallback) => {
  keycloak
    .init({
      onLoad: 'check-sso', // Usamos 'check-sso' para evitar redirigir siempre al login si ya está autenticado
      promiseType: 'native',
    })
    .then((authenticated) => {
      if (authenticated) {
        // Si la autenticación fue exitosa, pasa al callback
        console.log('Usuario autenticado:', keycloak.tokenParsed?.email)
        onAuthenticatedCallback()
      } /*else {
        keycloak.login() // Si no está autenticado, inicia el login
      }*/
    })
    .catch((error) => {
      console.error('Error al inicializar Keycloak', error)
      // Aquí podrías agregar un manejo de errores más adecuado, como mostrar un mensaje al usuario
    })
}

// Funciones de login, logout y obtención de token
export const login = () => keycloak.login()
export const logout = () => {
  keycloak.logout({ redirectUri: 'http://localhost:8910/home' }) // Redirige después de logout
}
export const getToken = () => keycloak.token

export { AuthProvider, useAuth, keycloak }
