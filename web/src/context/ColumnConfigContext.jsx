// ColumnConfigContext.jsx
import React, { createContext, useState } from 'react'

export const ColumnConfigContext = createContext()

export const ColumnConfigProvider = ({ children }) => {
  // currentTable contendrá { tableName, columns } para la tabla activa.
  const [currentTable, setCurrentTable] = useState(null)

  const setCurrentTableConfig = (config) => {
    setCurrentTable(config)
  }

  const toggleTableColumn = (tableName, columnName) => {
    // Si la tabla activa coincide, actualizamos sus columnas.
    if (currentTable && currentTable.tableName === tableName) {
      const newColumns = currentTable.columns.map((col) =>
        col.name === columnName ? { ...col, visible: !col.visible } : col
      )
      setCurrentTable({ ...currentTable, columns: newColumns })
    }
  }

  return (
    <ColumnConfigContext.Provider
      value={{ currentTable, setCurrentTableConfig, toggleTableColumn }}
    >
      {children}
    </ColumnConfigContext.Provider>
  )
}
