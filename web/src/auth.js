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
        console.log('Usuario autenticado:', keycloak.tokenParsed?.email)
        onAuthenticatedCallback()
      }
      // Puedes descomentar el login automático si lo prefieres:
      /* else {
        keycloak.login()
      } */
    })
    .catch((error) => {
      console.error('Error al inicializar Keycloak', error)
      // Agrega manejo de errores adicional si es necesario
    })
}

// Funciones de login, logout y obtención de token
export const login = () => keycloak.login()
export const logout = () => {
  // Asegúrate de que el redirectUri esté permitido en la configuración del cliente Keycloak
  keycloak.logout({ redirectUri: 'http://localhost:8910/home' })
}
export const getToken = () => keycloak.token

export { AuthProvider, useAuth, keycloak }
