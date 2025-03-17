import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { QUERY } from 'src/components/Servidor/ServidorsCell'
import { ColumnConfigContext } from 'src/context/ColumnConfigContext'
import { useRefresh } from 'src/context/RefreshContext'
import { useSearch } from 'src/context/SearchContext'
import { TableDataContext } from 'src/context/TableDataContext'
import { formatEnum, jsonTruncate, truncate } from 'src/lib/formatters'

import './Servidors.css'

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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ServidorsList = ({ servidors }) => {
  const { setTableData, setTableConfig } = useContext(TableDataContext)
  const { search } = useSearch()
  const { refresh } = useRefresh()
  const { refetch } = useQuery(QUERY)
  const { data: usuariosData } = useQuery(GET_USUARIOS_QUERY)

  const usuariosMap = usuariosData?.usuarios.reduce((map, usuario) => {
    map[usuario.id] = usuario.nombre_usuario
    return map
  }, {})

  const [servidoresData, setServidoresData] = useState(servidors)

  useEffect(() => {
    setServidoresData(servidors)
  }, [servidors])

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

  useEffect(() => {
    if (refresh) {
      refetch().then(({ data }) => {
        if (data?.servidors) {
          setServidoresData(data.servidors)
        }
      })
    }
  }, [refresh, refetch])

  // Filtra los servidores según la búsqueda
  const filteredServidors = useMemo(() => {
    return servidoresData?.filter((servidor) => {
      const lowerSearch = search?.toLowerCase() || ''
      return (
        String(servidor.id)?.toLowerCase().includes(lowerSearch) ||
        servidor.nombre?.toLowerCase().includes(lowerSearch) ||
        servidor.nodo?.toLowerCase().includes(lowerSearch) ||
        servidor.ip?.toLowerCase().includes(lowerSearch) ||
        servidor.tipo?.toLowerCase().includes(lowerSearch)
      )
    })
  }, [search, servidoresData])

  const tableName = 'Servidors'
  const [selectedServidores, setSelectedServidores] = useState([])

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
      {
        name: 'fecha_modificacion',
        label: 'Fecha modificacion',
        visible: false,
      },
      {
        name: 'usuario_modificacion',
        label: 'Usuario modificacion',
        visible: false,
      },
      { name: 'data_center', label: 'Data Center', visible: true },
    ],
    []
  )

  const { setCurrentTableConfig, currentTable } =
    useContext(ColumnConfigContext)

  useEffect(() => {
    if (!currentTable || currentTable.tableName !== tableName) {
      setCurrentTableConfig({ tableName, columns: initialColumns })
    }
  }, [setCurrentTableConfig, tableName, initialColumns, currentTable])

  const columnsToDisplay =
    currentTable && currentTable.tableName === tableName
      ? currentTable.columns.filter((col) => col.visible)
      : initialColumns

  useEffect(() => {
    setTableData(filteredServidors)
    setTableConfig({
      tableName,
      filas: selectedServidores,
      columns: columnsToDisplay,
      usuarios: usuariosMap,
    })
  }, [
    filteredServidors,
    selectedServidores,
    columnsToDisplay,
    setTableData,
    setTableConfig,
    tableName,
    usuariosMap,
  ])
  const renderCell = (servidor, colName) => {
    switch (colName) {
      case 'checkbox':
        return (
          <input
            type="checkbox"
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
        return (
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(servidor.metadata, null, 2)}
          </pre>
        )
      case 'fecha_creacion':
        return truncate(formatDate(servidor.fecha_creacion))
      case 'usuario_creacion':
        return truncate(usuariosMap?.[servidor?.usuario_creacion] || 'N/A')
      case 'fecha_modificacion':
        return truncate(formatDate(servidor.fecha_modificacion))
      case 'usuario_modificacion':
        return truncate(usuariosMap?.[servidor?.usuario_modificacion] || 'N/A')
      case 'data_center':
        return truncate(servidor?.data_centers?.nombre)
      default:
        return ''
    }
  }

  const allSelected =
    filteredServidors?.length > 0 &&
    selectedServidores.length === filteredServidors?.length

  return (
    <div className="servidores-container">
      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  className="styled-checkbox"
                  checked={allSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedServidores(
                        filteredServidors.map((servidor) => servidor.id)
                      )
                    } else {
                      setSelectedServidores([])
                    }
                  }}
                />
              </th>
              {columnsToDisplay
                .filter((col) => col.name !== 'checkbox')
                .map((col) => (
                  <th key={col.name} className="table-header">
                    <div className="header-content">
                      {col.label}
                    </div>
                  </th>
                ))}
              <th className="actions-header">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredServidors?.map((servidor) => (
              <tr key={servidor.id} className="table-row">
                {columnsToDisplay.map((col) => (
                  <td key={col.name} className="table-cell">
                    <div className="cell-content">
                      {renderCell(servidor, col.name)}
                    </div>
                  </td>
                ))}
                <td className="actions-cell">
                  <div className="action-buttons">
                    <Link
                      to={routes.servidor({ id: servidor.id })}
                      className="action-btn view-btn"
                      title="Ver detalle"
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                    <Link
                      to={routes.editServidor({ id: servidor.id })}
                      className="action-btn edit-btn"
                      title="Editar"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      type="button"
                      className="action-btn delete-btn"
                      onClick={() => onDeleteClick(servidor.id)}
                      title="Eliminar"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredServidors?.length === 0 && (
        <div className="no-results">
          <i className="fas fa-database"></i>
          <p>No se encontraron servidores</p>
        </div>
      )}
    </div>
  )
}

export default ServidorsList
