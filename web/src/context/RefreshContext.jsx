import React, { createContext, useContext, useState } from 'react'

// Creamos el contexto de refresco
const RefreshContext = createContext()

export const useRefresh = () => {
  return useContext(RefreshContext)
}

export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false)

  const triggerRefresh = () => setRefresh((prev) => !prev)

  return (
    <RefreshContext.Provider value={{ refresh, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  )
}
