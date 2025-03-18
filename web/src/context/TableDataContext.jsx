import React, { createContext, useState } from 'react'

export const TableDataContext = createContext()

export const TableDataProvider = ({ children }) => {
  const [tableData, setTableData] = useState(null)
  const [tableConfig, setTableConfig] = useState(null)

  return (
    <TableDataContext.Provider
      value={{ tableData, setTableData, tableConfig, setTableConfig }}
    >
      {children}
    </TableDataContext.Provider>
  )
}
