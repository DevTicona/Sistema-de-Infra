// ColumnSelector.jsx
import React, { useContext } from 'react'

import {
  Checkbox,
  FormControlLabel,
  Box,
  Button,
  Typography,
} from '@mui/material'

import { ColumnConfigContext } from 'src/context/ColumnConfigContext'

const ColumnSelector = ({ onClose }) => {
  const { currentTable, toggleTableColumn } = useContext(ColumnConfigContext)

  if (!currentTable) {
    return (
      <Box p={2}>
        <Typography variant="body2">No hay columnas configuradas.</Typography>
        <Box textAlign="right">
          <Button onClick={onClose} size="small">
            Cerrar
          </Button>
        </Box>
      </Box>
    )
  }

  const { tableName, columns } = currentTable

  return (
    <Box p={2}>
      {columns.map((col) => (
        <FormControlLabel
          key={col.name}
          control={
            <Checkbox
              checked={col.visible}
              onChange={() => toggleTableColumn(tableName, col.name)}
            />
          }
          label={col.label}
        />
      ))}
      <Box textAlign="right" mt={1}>
        <Button onClick={onClose} size="small">
          Cerrar
        </Button>
      </Box>
    </Box>
  )
}

export default ColumnSelector
