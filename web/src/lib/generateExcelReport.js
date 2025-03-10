// src/lib/generateExcelReport.js
import * as XLSX from 'xlsx'

export const generateExcelReport = (data, columns, title = 'Reporte') => {
  if (!Array.isArray(data) || !Array.isArray(columns)) {
    console.error('Error: datos o columnas no son arrays válidos')
    return false
  }

  try {
    // Preparar los datos para Excel
    const excelData = data.map((item) => {
      const row = {}
      columns.forEach((column) => {
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

    // Crear un libro de trabajo
    const wb = XLSX.utils.book_new()

    // Crear una hoja de trabajo con los datos
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, title)

    // Guardar el archivo
    XLSX.writeFile(
      wb,
      `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`
    )
    return true
  } catch (error) {
    console.error('Error al generar Excel:', error)
    return false
  }
}
