// src/lib/generateCSVReport.js
import { saveAs } from 'file-saver'
import Papa from 'papaparse'

export const generateCSVReport = (data, columns, title = 'Reporte') => {
  if (!Array.isArray(data)) {
    console.error('Error: datos no es un array válido')
    return false
  }

  try {
    // Si no se proporcionan columnas, tomar todas las propiedades del primer objeto
    const columnsToUse =
      columns ||
      (data[0]
        ? Object.keys(data[0]).map((key) => ({
            name: key,
            label:
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
          }))
        : [])

    // Preparar los datos para CSV
    const csvData = data.map((item) => {
      const row = {}
      columnsToUse.forEach((column) => {
        // Obtener el valor según la columna
        let cellValue = item[column.name]

        // Formatear según el tipo de dato
        if (column.name === 'metadata' && cellValue) {
          cellValue = JSON.stringify(cellValue)
        } else if (column.name.includes('fecha') && cellValue) {
          cellValue = new Date(cellValue).toLocaleDateString('es-ES')
        } else if (column.name === 'data_center' && item.data_centers) {
          cellValue = item.data_centers.nombre
        }

        // Asignar al objeto de fila con el nombre de la columna como clave
        row[column.label] = cellValue || ''
      })
      return row
    })

    // Convertir a CSV usando PapaParse
    const csv = Papa.unparse(csvData)

    // Crear un blob con el contenido CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })

    // Guardar el archivo usando FileSaver
    saveAs(
      blob,
      `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    )
    return true
  } catch (error) {
    console.error('Error al generar CSV:', error)
    return false
  }
}
