// src/lib/generatePDFReport.js
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const generatePDFReport = (data, columns, title = 'Reporte') => {
  if (!Array.isArray(data) || !Array.isArray(columns)) {
    console.error('Error: datos o columnas no son arrays válidos')
    return false
  }

  try {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF('l', 'mm', 'a4') // landscape, milímetros, a4

    // Configuración del documento
    doc.setFont('helvetica')
    doc.setFontSize(18)

    // Título del documento
    doc.text(title, 14, 20)

    // Fecha del reporte
    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 28)

    // Preparar los datos para autoTable
    const tableColumn = columns.map((col) => col.label)
    const tableRows = []

    // Procesar cada fila de datos
    data.forEach((item) => {
      const rowData = []
      columns.forEach((column) => {
        // Obtener el valor según la columna
        let cellValue = item[column.name]

        // Formatear según el tipo de dato
        if (column.name === 'metadata' && cellValue) {
          cellValue = JSON.stringify(cellValue).substring(0, 30) + '...'
        } else if (column.name.includes('fecha') && cellValue) {
          cellValue = new Date(cellValue).toLocaleDateString('es-ES')
        } else if (column.name === 'data_center' && item.data_centers) {
          cellValue = item.data_centers.nombre
        }

        // Si es nulo o indefinido, mostrar un guión
        rowData.push(cellValue || '-')
      })
      tableRows.push(rowData)
    })

    // Generar la tabla
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 14, right: 14 },
    })

    // Guardar el PDF
    doc.save(
      `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
    )
    return true
  } catch (error) {
    console.error('Error al generar PDF:', error)
    return false
  }
}
