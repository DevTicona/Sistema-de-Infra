import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Asignar las fuentes virtuales a pdfMake
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

export const generatePDFReport = (filas, data, columns, usuarios, title) => {
  try {
    console.log("Datos recibidos:", { filas, data, columns, usuarios, title });

    if (!Array.isArray(filas) || !Array.isArray(data) || !Array.isArray(columns)) {
      console.error('Error: datos o columnas no son arrays válidos');
      return false;
    }

    const usuariosArray = Object.entries(usuarios).map(([id, nombre]) => ({
      id: Number(id),
      nombre,
    }));

    const visibleColumns = columns.filter((col) => col.visible && col.label);

    const tableHeaders = visibleColumns.map((col) => ({
      text: col.label,
      bold: true,
      fontSize: 10,
      fillColor: '#f8f9fa',
    }));

    const tableRows = filas.map((id) => {
      const despliegue = data.find((item) => item.id === id);
      if (!despliegue) return [];

      return visibleColumns.map((column) => {
        let cellValue = '-';

        switch (column.name) {
          case 'servidor':
            cellValue = despliegue.servidores?.nombre || 'N/E';
            break;
          case 'componente':
            cellValue = despliegue.componentes?.nombre || 'N/E';
            break;
          case 'usuario':
            cellValue = despliegue.usuario_roles?.usuarios?.nombre_usuario || 'N/E';
            break;
          case 'rol':
            cellValue = despliegue.usuario_roles?.roles?.nombre || 'N/E';
            break;
          case 'estado':
            cellValue = despliegue.estado || 'N/E';
            break;
          case 'fecha_creacion':
            cellValue = despliegue.fecha_creacion
              ? new Date(despliegue.fecha_creacion).toLocaleDateString('es-ES')
              : '-';
            break;
          case 'fecha_modificacion':
            cellValue = despliegue.fecha_modificacion
              ? new Date(despliegue.fecha_modificacion).toLocaleDateString('es-ES')
              : '-';
            break;
          case 'usuario_creacion':
            const usuarioCreacion = usuariosArray.find(
              (user) => user.id === despliegue.usuario_creacion
            );
            cellValue = usuarioCreacion ? usuarioCreacion.nombre : 'N/E';
            break;
          case 'metadata':
            cellValue = JSON.stringify(despliegue.metadata, null, 2) || '-';
            break;
          case 'data_center':
            cellValue = despliegue.data_centers?.nombre || 'N/E';
            break;
          default:
            cellValue = despliegue[column.name] ?? '-';
        }

        return { text: String(cellValue), fontSize: 9 };
      });
    });

    const columnWidths = visibleColumns.map((col) => {
      if (col.name === 'metadata') return 120;
      if (col.name.includes('fecha')) return 'auto';
      return '*';
    });

    const documentDefinition = {
      pageOrientation: 'landscape',
      pageSize: 'A4',
      pageMargins: [20, 40, 20, 40],
      content: [
        { text: title, fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        {
          text: `Fecha: ${new Date().toLocaleDateString('es-ES')}`,
          fontSize: 10,
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: columnWidths,
            body: [tableHeaders, ...tableRows],
          },
          layout: {
            hLineWidth: (i) => (i === 0 || i === tableRows.length ? 1 : 1),
            vLineWidth: () => 0,
            hLineColor: (i) => (i === 0 ? '#bdbdbd' : '#e0e0e0'),
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 8,
            paddingBottom: () => 8,
          },
        },
      ],
      defaultStyle: {
        fontSize: 10,
      },
    };

    pdfMake
      .createPdf(documentDefinition)
      .download(
        `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
      );

    console.log("PDF generado correctamente");
    return true;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    return false;
  }
};
