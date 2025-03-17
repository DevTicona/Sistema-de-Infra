import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, routes, useParams } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { TablePagination, Checkbox, Table, TableBody,Box, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ColumnConfigContext } from 'src/context/ColumnConfigContext'
import { useRefresh } from 'src/context/RefreshContext'
import { useSearch } from 'src/context/SearchContext'
import { TableDataContext } from 'src/context/TableDataContext'
import { formatEnum, jsonTruncate, truncate } from 'src/lib/formatters'

// Consultas y mutaciones
const GET_USUARIOS_QUERY = gql`
  query UsuariosQuery {
    usuarios {
      id
      nombre_usuario
    }
  }
`

const DELETE_SERVIDOR_MUTATION = gql`
  mutation DeleteServidorMutation($id: Int!) {
    deleteServidor(id: $id) {
      id
    }
  }
`

const GET_SERVIDORES = gql`
  query GetServidores {
    servidors {
      id
      nro_cluster
      vmid
      nombre
      nodo
      ip
      tipo
      estado
      id_data_center
      metadata
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
      data_centers {
        nombre
      }
    }
  }
`

// Función para formatear la fecha
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const tableName = 'Servidors'

const ServidoresPage = () => {
  const { id, chasisId, bladeId } = useParams()

  // Consulta de servidores y de usuarios
  const { data, loading, error, refetch } = useQuery(GET_SERVIDORES)
  const { data: usuariosData } = useQuery(GET_USUARIOS_QUERY)
  const usuariosMap = usuariosData?.usuarios.reduce((map, usuario) => {
    map[usuario.id] = usuario.nombre_usuario
    return map
  }, {})

  // Contextos para filtrado global, refresco y configuración de tabla
  const { search } = useSearch()
  const { refresh } = useRefresh()
  const { setTableData, setTableConfig } = useContext(TableDataContext)
  const { setCurrentTableConfig, currentTable } = useContext(ColumnConfigContext)

  // Estado local para los datos de servidores (se actualiza con la consulta)
  const [servidoresData, setServidoresData] = useState([])
  useEffect(() => {
    if (data && data.servidors) {
      setServidoresData(data.servidors)
    }
  }, [data])

  // Mutación para eliminar servidor
  const [deleteServidor] = useMutation(DELETE_SERVIDOR_MUTATION, {
    onCompleted: async () => {
      toast.success('Servidor eliminado')
      await refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete servidor ' + id + '?')) {
      deleteServidor({ variables: { id } })
    }
  }

  // Refrescar datos cuando se active el flag de refresh
  useEffect(() => {
    if (refresh) {
      refetch().then(({ data }) => {
        if (data?.servidors) {
          setServidoresData(data.servidors)
        }
      })
    }
  }, [refresh, refetch])

  // Filtrado de servidores
  const filteredServidors = useMemo(() => {
    const lowerSearch = search?.toLowerCase() || ''
    return servidoresData.filter((servidor) => {
      return (
        servidor.id_data_center === parseInt(id) &&
        servidor.metadata &&
        servidor.metadata.chasis === `CH-0${chasisId}` &&
        servidor.metadata.blade === `BL-0${bladeId}` &&
        (
          String(servidor.id).toLowerCase().includes(lowerSearch) ||
          servidor.nombre?.toLowerCase().includes(lowerSearch) ||
          servidor.nodo?.toLowerCase().includes(lowerSearch) ||
          servidor.ip?.toLowerCase().includes(lowerSearch) ||
          servidor.tipo?.toLowerCase().includes(lowerSearch)
        )
      )
    })
  }, [search, servidoresData, id, chasisId, bladeId])

  // Selección de filas
  const [selectedServidores, setSelectedServidores] = useState([])

  // Columnas iniciales
  const initialColumns = useMemo(
    () => [
      { name: 'checkbox', label: '', visible: true, type: 'checkbox' },
      { name: 'id', label: 'Id', visible: true },
      { name: 'nro_cluster', label: 'Nro cluster', visible: true },
      { name: 'vmid', label: 'Vmid', visible: true },
      { name: 'nombre', label: 'Nombre', visible: true },
      { name: 'nodo', label: 'Nodo', visible: true },
      { name: 'ip', label: 'Ip', visible: true },
      { name: 'tipo', label: 'Tipo', visible: true },
      { name: 'estado', label: 'Estado', visible: true },
      { name: 'metadata', label: 'Metadata', visible: false },
      { name: 'fecha_creacion', label: 'Fecha creacion', visible: true },
      { name: 'usuario_creacion', label: 'Usuario creacion', visible: true },
      { name: 'fecha_modificacion', label: 'Fecha modificacion', visible: false },
      { name: 'usuario_modificacion', label: 'Usuario modificacion', visible: false },
      { name: 'data_center', label: 'Data Center', visible: true },
    ],
    []
  )

  useEffect(() => {
    if (!currentTable || currentTable.tableName !== tableName) {
      setCurrentTableConfig({ tableName, columns: initialColumns })
    }
  }, [setCurrentTableConfig, currentTable, initialColumns])

  const columnsToDisplay =
    currentTable && currentTable.tableName === tableName
      ? currentTable.columns.filter((col) => col.visible)
      : initialColumns

  // Actualizar datos y configuración de tabla en el contexto
  useEffect(() => {
    setTableData(filteredServidors)
    setTableConfig({
      tableName,
      filas: selectedServidores,
      columns: columnsToDisplay,
      usuarios: usuariosMap,
    })
  }, [filteredServidors, selectedServidores, columnsToDisplay, usuariosMap, setTableData, setTableConfig])

  // Función para renderizar el contenido de cada celda
  const renderCell = (servidor, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <Checkbox
            checked={selectedServidores.includes(servidor.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedServidores([...selectedServidores, servidor.id])
              } else {
                setSelectedServidores(
                  selectedServidores.filter((id) => id !== servidor.id)
                )
              }
            }}
          />
        )
      case 'id':
        return truncate(servidor.id)
      case 'nro_cluster':
        return truncate(servidor.nro_cluster)
      case 'vmid':
        return truncate(servidor.vmid)
      case 'nombre':
        return (
          <Link to={routes.despliegueSelector({ id: servidor.id })}>
            {truncate(servidor.nombre)}
          </Link>
        )
      case 'nodo':
        return truncate(servidor.nodo)
      case 'ip':
        return truncate(servidor.ip)
      case 'tipo':
        return truncate(servidor.tipo)
      case 'estado':
        return formatEnum(servidor.estado)
      case 'metadata':
        return jsonTruncate(servidor.metadata)
      case 'fecha_creacion':
        return truncate(formatDate(servidor.fecha_creacion))
      case 'usuario_creacion':
        return truncate(usuariosMap?.[servidor.usuario_creacion] || 'N/A')
      case 'fecha_modificacion':
        return truncate(formatDate(servidor.fecha_modificacion))
      case 'usuario_modificacion':
        return truncate(usuariosMap?.[servidor.usuario_modificacion] || 'N/A')
      case 'data_center':
        return truncate(servidor?.data_centers?.nombre)
      default:
        return ''
    }
  }

  const allSelected =
    filteredServidors.length > 0 &&
    selectedServidores.length === filteredServidors.length

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <h2 className="title">
        Data Center {id} -- Chasis {chasisId} -- Blade {bladeId}
      </h2>


      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={allSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedServidores(filteredServidors.map((s) => s.id))
                    } else {
                      setSelectedServidores([])
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
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServidors?.map((servidor) => (
              <TableRow key={servidor.id}>
                {columnsToDisplay.map((col) => (
                  <TableCell key={col.name}>{renderCell(servidor, col.name)}</TableCell>
                ))}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      component={Link}
                      to={routes.servidor({ id: servidor.id })}
                      title={'Show servidor ' + servidor.id + ' detail'}
                      size="small"
                      color="success"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={routes.editServidor({ id: servidor.id })}
                      title={'Edit servidor ' + servidor.id}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      title={'Delete servidor ' + servidor.id}
                      onClick={() => onDeleteClick(servidor.id)}
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
    </div>
  )
}

export default ServidoresPage
