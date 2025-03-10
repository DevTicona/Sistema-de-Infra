import { generateCSVReport } from 'src/lib/generateCSVReport'
import { generateExcelReport } from 'src/lib/generateExcelReport'
import { generatePDFReport } from 'src/lib/generatePDFReport'

export const useReportGenerator = () => {
  const generateReport = (type, data, columns, title) => {
    if (!Array.isArray(columns)) {
      console.error('Error: columns no es un array:', columns)
      return false
    }

    try {
      switch (type) {
        case 'pdf':
          console.log('Generating PDF report with columns:', columns)
          generatePDFReport(data, columns, title)
          break
        case 'excel':
          generateExcelReport(data, columns)
          break
        case 'csv':
          generateCSVReport(data)
          break
        default:
          console.error('Formato no soportado')
          return false
      }
      return true
    } catch (error) {
      console.error('Error al generar reporte:', error)
      return false
    }
  }

  return { generateReport }
}
