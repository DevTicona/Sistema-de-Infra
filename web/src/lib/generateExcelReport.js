import * as XLSX from 'xlsx';

export const generateExcelReport = (filas, data, columns, usuarios, title) => {
  if (!Array.isArray(filas) || !Array.isArray(data) || !Array.isArray(columns)) {
    console.error('Error: filas, datos o columnas no son arrays válidos');
    return false;
  }

  try {
    const usuariosArray = Object.entries(usuarios).map(([id, nombre]) => ({
      id: Number(id),
      nombre,
    }));

    // Filtrar datos según las filas seleccionadas
    const filteredData = data.filter((item) => filas.includes(item.id));

    // Mapear los datos para el Excel
    const excelData = filteredData.map((item) => {
      const row = {};

      columns.forEach((column) => {
        let cellValue = item[column.name];

        switch (column.name) {
          case 'metadata':
            cellValue = cellValue ? JSON.stringify(cellValue) : '';
            break;
          case 'servidor':
            cellValue = item.servidores?.nombre || 'N/A';
            break;
          case 'componente':
            cellValue = item.componentes?.nombre || 'N/A';
            break;
          case 'rol':
            cellValue = item.roles?.nombre || 'N/A';
            break;
          case 'usuario':
            if (item.usuario_roles && Array.isArray(item.usuario_roles) && item.usuario_roles.length > 0) {
              cellValue = item.usuario_roles
                .map((ur) => ur.usuarios?.nombre_usuario)
                .filter(Boolean)
                .join(', ');
            } else if (item.usuarios) {
              cellValue = item.usuarios?.nombre_usuario || 'N/A';
            } else {
              cellValue = 'N/A';
            }
            break;
          case 'sistema':
            cellValue = item.sistemas?.nombre || 'N/A';
            break;
          case 'despliegue':
            cellValue = item.despliegue?.nombre || 'N/A';
            break;
          case 'data_center':
            cellValue = item.data_centers?.nombre || 'N/A';
            break;
          case 'entidad':
            cellValue = item.entidades?.nombre || 'N/A';
            break;
          case 'usuario_creacion':
            const usuario = usuariosArray.find((user) => user.id === item.usuario_creacion);
            cellValue = usuario ? usuario.nombre : 'N/E';
            break;
          default:
            if (column.name.includes('fecha') && cellValue) {
              cellValue = new Date(cellValue).toLocaleDateString('es-ES');
            }
        }

        row[column.label] = cellValue || '';
      });

      // Procesar respaldo_creacion como columnas adicionales
      if (item.respaldo_creacion && typeof item.respaldo_creacion === 'object') {
        Object.entries(item.respaldo_creacion).forEach(([key, value]) => {
          row[`Respaldo ${key.charAt(0).toUpperCase() + key.slice(1)}`] = value;
        });
      }

      return row;
    });

    // Crear el archivo Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData, { cellStyles: true });

    // Aplicar estilos profesionales con colores
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4F81BD' } }, // Azul oscuro
      alignment: { horizontal: 'center' },
    };

    const activeStyle = {
      fill: { fgColor: { rgb: 'C6EFCE' } }, // Verde suave
    };

    const inactiveStyle = {
      fill: { fgColor: { rgb: 'FFC7CE' } }, // Rojo suave
    };

    // Aplicar estilos a los encabezados
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[headerCell]) continue;
      ws[headerCell].s = headerStyle;
    }

    // Aplicar estilos condicionales a las filas
    for (let R = 1; R <= range.e.r; ++R) {
      const statusCell = XLSX.utils.encode_cell({
        r: R,
        c: columns.findIndex((col) => col.name === 'estado'),
      });
      if (ws[statusCell]) {
        ws[statusCell].s =
          ws[statusCell].v === 'Activo' ? activeStyle : inactiveStyle;
      }
    }

    // Añadir la hoja al libro y guardar el archivo
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(
      wb,
      `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    return true;
  } catch (error) {
    console.error('Error al generar Excel:', error);
    return false;
  }
};
