import { createContext, useContext, useState } from 'react'

// Se crea el contexto de filtros
const FilterContext = createContext()

// Provider que envuelve la aplicación o la parte que requiera acceder a los filtros
export const FilterProvider = ({ children }) => {
  // Estado inicial: se pueden incluir campos como 'issuedBy', 'valor', 'fechaInicio' y 'fechaFin'
  const [filters, setFilters] = useState({
    // issuedBy: '',  // Ej: 'estado', 'fechas', 'creado_por', 'modificado_por'
    // valor: '',     // Ej: 'ACTIVO', 'INACTIVO'
    // fechaInicio: '',
    // fechaFin: '',
  })

  // Función para actualizar un campo del filtro
  const updateFilter = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }))
  }

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setFilters({})
  }

  return (
    <FilterContext.Provider value={{ filters, updateFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

// Hook personalizado para utilizar el contexto de filtros
export const useFilter = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}
