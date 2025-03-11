import { generateCSVReport } from 'src/lib/generateCSVReport'
import { generateExcelReport } from 'src/lib/generateExcelReport'
import { generatePDFReport } from 'src/lib/generatePDFReport'

export const useReportGenerator = () => {
  const generateReport = (type, data, filas, columns, usuarios, title) => {
    if (!Array.isArray(columns)) {
      console.error('Error: columns no es un array:', columns)
      return false
    }

    try {
      switch (type) {
        case 'pdf':
          console.log('Generando PDF reporte con las columnas:', columns)
          console.log('Generando PDF reporte con los datos:', data)
          console.log('Generando PDF reporte con los usuarios:', usuarios)
          generatePDFReport(filas, data, columns, usuarios, title)
          break
        case 'excel':
          generateExcelReport(filas, data, columns, usuarios, title)
          break
        case 'csv':
          generateCSVReport(filas, data, columns, usuarios, title)
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
