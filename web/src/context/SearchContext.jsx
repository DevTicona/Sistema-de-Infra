// src/context/SearchContext.js

import React, { createContext, useState, useContext } from 'react'

// Crear el contexto de búsqueda
const SearchContext = createContext()

export const useSearch = () => {
  return useContext(SearchContext)
}

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState('')

  // Función para actualizar el valor de búsqueda
  const handleSearchChange = (value) => {
    setSearch(value)
  }

  return (
    <SearchContext.Provider value={{ search, handleSearchChange }}>
      {children}
    </SearchContext.Provider>
  )
}
