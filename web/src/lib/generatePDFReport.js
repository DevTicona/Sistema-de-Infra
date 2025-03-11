import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

// Asignar las fuentes virtuales a pdfMake
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs

export const generatePDFReport = (filas, data, columns, usuarios, title) => {
  const usuariosArray = Object.entries(usuarios).map(([id, nombre]) => ({
    id: Number(id),
    nombre,
  }))

  console.log(usuariosArray) // Verificar la estructuras
  if (
    !Array.isArray(filas) ||
    !Array.isArray(data) ||
    !Array.isArray(columns)
  ) {
    console.error('Error: datos o columnas no son arrays válidos')
    return false
  }

  try {
    // Filtrar columnas visibles
    const visibleColumns = columns.filter((col) => col.visible && col.label)

    // Crear el encabezado de la tabla con las etiquetas de las columnas
    const tableHeaders = visibleColumns.map((col) => ({
      text: col.label,
      bold: true,
      fontSize: 10,
      fillColor: '#f8f9fa',
    }))

    // Preparar las filas de datos solo con las filas seleccionadas
    const tableRows = filas.map((id) => {
      const servidor = data.find((item) => item.id === id)
      if (!servidor) return []

      return visibleColumns.map((column) => {
        let cellValue =
          servidor[column.name] !== undefined ? servidor[column.name] : '-'

        // Formatear según el tipo de dato
        if (column.name.includes('fecha') && cellValue !== '-') {
          cellValue = new Date(cellValue).toLocaleDateString('es-ES')
        } else if (
          column.name === 'usuario_creacion' &&
          servidor.usuario_creacion
        ) {
          // Buscar el nombre del usuario que corresponde al ID
          const usuario = usuariosArray.find(
            (user) => user.id === servidor.usuario_creacion
          )
          cellValue = usuario ? usuario.nombre : 'N/E'
        } else if (column.name === 'data_center' && servidor.data_centers) {
          cellValue = servidor.data_centers.nombre
        }
        return { text: String(cellValue), fontSize: 9 }
      })
    })

    // Calcular anchos de columna proporcionales o fijos
    const columnWidths = visibleColumns.map((col) => {
      if (col.name.includes('id') || col.name.includes('fecha')) {
        return 'auto'
      }
      return '*'
    })

    // Definir el contenido del PDF
    const documentDefinition = {
      pageOrientation: 'landscape', // Cambiar a horizontal si hay muchas columnas
      pageSize: 'A4',
      pageMargins: [20, 40, 20, 40],
      content: [
        { text: title, fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        {
          text: `Fecha: ${new Date().toLocaleDateString('es-ES')}`,
          fontSize: 10,
          margin: [0, 0, 0, 20],
        },

        // Tabla
        {
          table: {
            headerRows: 1,
            widths: columnWidths,
            body: [
              tableHeaders, // Encabezados de la tabla
              ...tableRows, // Filas de datos
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 1 : 1
            },
            vLineWidth: function () {
              return 0
            },
            hLineColor: function (i) {
              return i === 0 ? '#bdbdbd' : '#e0e0e0'
            },
            paddingLeft: function () {
              return 8
            },
            paddingRight: function () {
              return 8
            },
            paddingTop: function () {
              return 8
            },
            paddingBottom: function () {
              return 8
            },
          },
        },
      ],
      defaultStyle: {
        fontSize: 10,
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
        },
      },
    }

    // Generar el PDF
    pdfMake
      .createPdf(documentDefinition)
      .download(
        `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
      )

    return true
  } catch (error) {
    console.error('Error al generar PDF:', error)
    return false
  }
}
