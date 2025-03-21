import { saveAs } from 'file-saver'
import Papa from 'papaparse'

export const generateCSVReport = (filas, data, columns, usuarios, title) => {
  if (
    !Array.isArray(filas) ||
    !Array.isArray(data) ||
    !Array.isArray(columns)
  ) {
    console.error('Error: filas, datos o columnas no son arrays válidos')
    return false
  }

  try {
    // Convertir usuarios en un array de objetos { id, nombre }
    const usuariosArray = Object.entries(usuarios).map(([id, nombre]) => ({
      id: Number(id),
      nombre,
    }))

    // Filtrar solo las filas seleccionadas
    const filteredData = data.filter((item) => filas.includes(item.id))

    // Preparar los datos para CSV
    const csvData = filteredData.map((item) => {
      const row = {}
      columns.forEach((column) => {
        let cellValue = item[column.name]

        // Formatear según el tipo de dato
        if (column.name === 'metadata' && cellValue) {
          cellValue = JSON.stringify(cellValue)
        } else if (column.name.includes('fecha') && cellValue) {
          cellValue = new Date(cellValue).toLocaleDateString('es-ES')
        } else if (column.name === 'data_center' && item.data_centers) {
          cellValue = item.data_centers.nombre
        } else if (
          column.name === 'usuario_creacion' &&
          item.usuario_creacion
        ) {
          // Buscar el nombre del usuario por ID
          const usuario = usuariosArray.find(
            (user) => user.id === item.usuario_creacion
          )
          cellValue = usuario ? usuario.nombre : 'N/E'
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
