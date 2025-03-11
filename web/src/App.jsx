import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import { FilterProvider } from 'src/context/FilterContext'
import FatalErrorPage from 'src/pages/FatalErrorPage'

import { AuthProvider, useAuth } from './auth'
import { RefreshProvider } from './context/RefreshContext'
import { SearchProvider } from './context/SearchContext'
import { TableDataProvider } from './context/TableDataContext'
import './index.css'
import './scaffold.css'

const App = ({ children }) => (
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

export default App
