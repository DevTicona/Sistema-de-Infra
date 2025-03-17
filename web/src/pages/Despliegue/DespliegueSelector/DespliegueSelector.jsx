import { useContext, useEffect, useMemo, useState } from 'react'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Checkbox,
  TablePagination,
  TableSortLabel,
  IconButton,
  Box,
} from '@mui/material'

import { useParams, Link, routes } from '@redwoodjs/router'
import { useQuery, gql, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { useStyles } from './styles'

import { useSearch } from 'src/context/SearchContext'
import { useRefresh } from 'src/context/RefreshContext'
import { TableDataContext } from 'src/context/TableDataContext'
import { ColumnConfigContext } from 'src/context/ColumnConfigContext'

// Consulta para obtener el servidor y sus despliegues
const QUERY = gql`
  query obtenerServidoresById($id: Int!) {
    servidor: servidor(id: $id) {
      id
      nombre
      despliegue {
        id
        agrupador
        tipo
        estado
        fecha_creacion
        componentes {
          id
          nombre
          entorno
          categoria
          sistemas {
            id
            nombre
          }
        }
      }
    }
  }
`

// (Opcional) Mutación para eliminar un despliegue, si se implementa la funcionalidad de borrado
const DELETE_DESPLIEGUE_MUTATION = gql`
  mutation DeleteDespliegueMutation($id: Int!) {
    deleteDespliegue(id: $id) {
      id
    }
  }
`

const formatFecha = (fecha) => {
  const date = new Date(fecha)
  return date.toLocaleString()
}

const DespliegueSelector = () => {
  const { id } = useParams()
  const styles = useStyles

  // Contextos para búsqueda, refresco y configuración de tabla
  const { search } = useSearch()
  const { refresh } = useRefresh()
  const { setTableData, setTableConfig } = useContext(TableDataContext)
  const { currentTable, setCurrentTableConfig } = useContext(ColumnConfigContext)

  // Consulta del servidor y despliegues
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { id: parseInt(id) },
  })

  // Estado local para almacenar los despliegues
  const [despliegueData, setDespliegueData] = useState([])
  // Estado para la paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  // Estado para selección de filas
  const [selectedDespliegue, setSelectedDespliegue] = useState([])

  // (Opcional) Mutación para eliminar despliegue
  const [deleteDespliegue] = useMutation(DELETE_DESPLIEGUE_MUTATION, {
    onCompleted: () => {
      toast.success('Despliegue eliminado')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Actualizar despliegueData cuando se reciben los datos de la consulta
  useEffect(() => {
    if (data && data.servidor) {
      setDespliegueData(data.servidor.despliegue)
    }
  }, [data])

  // Refrescar datos cuando se active el flag de refresco
  useEffect(() => {
    if (refresh) {
      refetch().then(({ data }) => {
        if (data && data.servidor) {
          setDespliegueData(data.servidor.despliegue)
        }
      })
    }
  }, [refresh, refetch])

  // Filtrado global basado en el contexto search
  const filteredDespliegue = useMemo(() => {
    const lowerSearch = search?.toLowerCase() || ''
    return despliegueData.filter((d) => {
      const componenteNombre = d.componentes?.nombre?.toLowerCase() || ''
      const entorno = d.componentes?.entorno?.toLowerCase() || ''
      const categoria = d.componentes?.categoria?.toLowerCase() || ''
      const sistemaNombre = d.componentes?.sistemas?.nombre?.toLowerCase() || ''
      const agrupador = d.agrupador?.toLowerCase() || ''
      const tipo = d.tipo?.toLowerCase() || ''
      const estado = d.estado?.toLowerCase() || ''
      const idStr = String(d.id)
      return (
        idStr.includes(lowerSearch) ||
        componenteNombre.includes(lowerSearch) ||
        entorno.includes(lowerSearch) ||
        categoria.includes(lowerSearch) ||
        sistemaNombre.includes(lowerSearch) ||
        agrupador.includes(lowerSearch) ||
        tipo.includes(lowerSearch) ||
        estado.includes(lowerSearch)
      )
    })
  }, [search, despliegueData])

  // Configuración inicial de columnas para esta tabla
  const tableName = 'DespliegueSelector'
  const initialColumns = useMemo(
    () => [
      { name: 'checkbox', label: '', visible: true, type: 'checkbox' },
      { name: 'id', label: 'ID', visible: true },
      { name: 'componente', label: 'Componente', visible: true },
      { name: 'entorno', label: 'Entorno', visible: true },
      { name: 'categoria', label: 'Categoría', visible: true },
      { name: 'sistema', label: 'Sistema', visible: true },
      { name: 'agrupador', label: 'Agrupador', visible: true },
      { name: 'tipo', label: 'Tipo', visible: true },
      { name: 'estado', label: 'Estado', visible: true },
      { name: 'fecha_creacion', label: 'Fecha Creación', visible: true },
    ],
    []
  )

  useEffect(() => {
    if (!currentTable || currentTable.tableName !== tableName) {
      setCurrentTableConfig({ tableName, columns: initialColumns })
    }
  }, [currentTable, setCurrentTableConfig, initialColumns, tableName])

  const columnsToDisplay =
    currentTable && currentTable.tableName === tableName
      ? currentTable.columns.filter((col) => col.visible)
      : initialColumns

  // Actualizar el contexto de la tabla
  useEffect(() => {
    setTableData(filteredDespliegue)
    setTableConfig({
      tableName,
      filas: selectedDespliegue,
      columns: columnsToDisplay,
    })
  }, [filteredDespliegue, selectedDespliegue, columnsToDisplay, setTableData, setTableConfig, tableName])

  // Manejadores de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Función para renderizar el contenido de cada celda según la columna
  const renderCell = (despliegue, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <Checkbox
            checked={selectedDespliegue.includes(despliegue.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedDespliegue([...selectedDespliegue, despliegue.id])
              } else {
                setSelectedDespliegue(
                  selectedDespliegue.filter((id) => id !== despliegue.id)
                )
              }
            }}
          />
        )
      case 'id':
        return despliegue.id
      case 'componente':
        return (
          <Link to={routes.componente({ id: despliegue.componentes?.id })} style={{ textDecoration: 'none' }}>
            {despliegue.componentes?.nombre || 'N/A'}
          </Link>
        )
      case 'entorno':
        return despliegue.componentes?.entorno || 'N/A'
      case 'categoria':
        return despliegue.componentes?.categoria || 'N/A'
      case 'sistema':
        return (
          <Link to={routes.sistema({ id: despliegue.componentes?.sistemas?.id })} style={{ textDecoration: 'none' }}>
            {despliegue.componentes?.sistemas?.nombre || 'N/A'}
          </Link>
        )
      case 'agrupador':
        return despliegue.agrupador
      case 'tipo':
        return despliegue.tipo
      case 'estado':
        return despliegue.estado
      case 'fecha_creacion':
        return formatFecha(despliegue.fecha_creacion)
      default:
        return ''
    }
  }

  // Filas a mostrar en la página actual
  const pageRows = filteredDespliegue.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )
  const allSelected =
    pageRows.length > 0 &&
    pageRows.every((d) => selectedDespliegue.includes(d.id))

  if (loading)
    return (
      <Typography style={styles.typography}>
        Cargando despliegues...
      </Typography>
    )
  if (error)
    return (
      <Typography color="error" style={styles.typography}>
        Error al cargar los despliegues: {error.message}
      </Typography>
    )

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Despliegues del servidor: {data.servidor.nombre}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>
                <Checkbox
                  checked={allSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDespliegue(pageRows.map((d) => d.id))
                    } else {
                      setSelectedDespliegue(
                        selectedDespliegue.filter(
                          (id) => !pageRows.some((d) => d.id === id)
                        )
                      )
                    }
                  }}
                />
              </TableCell>
              {columnsToDisplay
                .filter((col) => col.name !== 'checkbox')
                .map((col) => (
                  <TableCell key={col.name}>
                    <TableSortLabel>{col.label}</TableSortLabel>
                  </TableCell>
                ))}
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((despliegue) => (
              <TableRow key={despliegue.id} hover>
                {columnsToDisplay.map((col) => (
                  <TableCell key={col.name}>
                    {renderCell(despliegue, col.name)}
                  </TableCell>
                ))}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      component={Link}
                      to={routes.despliegue({ id: despliegue.id })}
                      title={'Ver detalle del despliegue ' + despliegue.id}
                      size="small"
                      color="success"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={routes.editDespliegue({ id: despliegue.id })}
                      title={'Editar despliegue ' + despliegue.id}
                      size="small"
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      title={'Eliminar despliegue ' + despliegue.id}
                      onClick={() => {
                        if (
                          confirm(
                            '¿Está seguro de eliminar el despliegue ' +
                              despliegue.id +
                              '?'
                          )
                        ) {
                          // Ejecutar mutación de eliminación si está implementada
                          deleteDespliegue({ variables: { id: despliegue.id } })
                        }
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredDespliegue.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default DespliegueSelector
