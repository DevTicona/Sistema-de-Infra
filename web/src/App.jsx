import { useEffect } from 'react'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import { FilterProvider } from 'src/context/FilterContext'
import FatalErrorPage from 'src/pages/FatalErrorPage'

// Importa el AuthProvider, useAuth y la función de inicialización de Keycloak
import { AuthProvider, useAuth, initKeycloak } from './auth'
import { RefreshProvider } from './context/RefreshContext'
import { SearchProvider } from './context/SearchContext'
import { TableDataProvider } from './context/TableDataContext'
import './index.css'
import './scaffold.css'

// eslint-disable-next-line import/order
import { navigate, routes } from '@redwoodjs/router'
const App = ({ children }) => {
  // Opcional: inicializar Keycloak al cargar la aplicación.
  // Si deseas que al iniciar se verifique si existe una sesión Keycloak activa, descomenta este bloque.
  useEffect(() => {
    initKeycloak(() => {
      console.log('Keycloak inicializado.')
      navigate(routes.home())
    })
  }, [])

  return (
    <FatalErrorBoundary page={FatalErrorPage}>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <AuthProvider>
          <RedwoodApolloProvider useAuth={useAuth}>
            <SearchProvider>
              <FilterProvider>
                <RefreshProvider>
                  <TableDataProvider>{children}</TableDataProvider>
                </RefreshProvider>
              </FilterProvider>
            </SearchProvider>
          </RedwoodApolloProvider>
        </AuthProvider>
      </RedwoodProvider>
    </FatalErrorBoundary>
  )
}

export default App
