import { useMemo, useEffect, useState, useContext } from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FilterListIcon from '@mui/icons-material/FilterList'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import {
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Popover,
  Menu,
  MenuItem,
  Drawer,
} from '@mui/material'
import debounce from 'lodash/debounce'

import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import { ColumnConfigProvider } from 'src/context/ColumnConfigContext'
import ColumnSelector from 'src/context/ColumnSelector'
import { useFilter } from 'src/context/FilterContext'
import { useRefresh } from 'src/context/RefreshContext'
import { useSearch } from 'src/context/SearchContext'
import { TableDataContext } from 'src/context/TableDataContext'
import { useReportGenerator } from 'src/hooks/useReportGenerator'

// Importamos el contexto de filtros

const AccesoriosLayout = ({
  title,
  titleTo,
  buttonLabel,
  buttonTo,
  children,
}) => {
  // Hook para generar reportes
  const { generateReport } = useReportGenerator()

  // Obtiene datos y configuración de columnas
  const { tableData, tableConfig } = useContext(TableDataContext)

  // Manejo de búsqueda con debounce
  const { search, handleSearchChange } = useSearch()
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        handleSearchChange(value)
      }, 50),
    [handleSearchChange]
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  // Refresco de datos
  const { triggerRefresh } = useRefresh()
  const [loading, setLoading] = useState(false)
  const handleRefresh = () => {
    setLoading(true)
    triggerRefresh()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  // Manejo del menú de descarga
  const [anchorElDownload, setAnchorElDownload] = useState(null)
  const handleClickDownload = (event) => {
    setAnchorElDownload(event.currentTarget)
  }
  const handleCloseDownloadMenu = () => {
    setAnchorElDownload(null)
  }

  // Manejo del popover para selector de columnas
  const [anchorEl, setAnchorEl] = useState(null)
  const handleOpenColumnSelector = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseColumnSelector = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  // Utilizamos el contexto de filtros en lugar de estado local
  const { filters, updateFilter, clearFilters } = useFilter()
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const handleOpenFilterDrawer = () => {
    setFilterDrawerOpen(true)
  }

  const handleCloseFilterDrawer = () => {
    setFilterDrawerOpen(false)
  }

  // Filtrado de datos según los filtros aplicados
  const filteredData = useMemo(() => {
    return tableData?.filter((item) => {
      return Object.entries(filters).every(([key, value]) =>
        value ? item[key]?.toString().includes(value) : true
      )
    })
  }, [tableData, filters])

  // Función para manejar la descarga de reportes
  const handleDownload = (type) => {
    handleCloseDownloadMenu()

    const currentTableColumns = tableConfig?.columns || []
    const currentTableFilas = tableConfig?.filas || []
    const currentUsers = tableConfig?.usuarios || []

    if (!Array.isArray(currentTableColumns)) {
      console.error(
        'Error: columnsToDisplay no es un array:',
        currentTableColumns
      )
      alert(
        'Hubo un error al generar el reporte. Verifica la configuración de las columnas.'
      )
      return
    }

    const success = generateReport(
      type,
      tableData,
      currentTableFilas,
      currentTableColumns,
      currentUsers,
      title
    )
    if (!success) {
      alert(
        'Hubo un error al generar el reporte. Verifica la configuración de las columnas.'
      )
    }
  }

  return (
    <ColumnConfigProvider>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />

        {/* Encabezado */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to={routes[titleTo]()}
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            {title}
          </Typography>
          <IconButton
            color="primary"
            onClick={() => window.history.back()}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* Barra de herramientas */}
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={1}
          mt={2}
          mb={2}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar"
            value={search}
            onChange={(e) => debouncedSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
          <Tooltip title="Refrescar">
            <IconButton
              color="primary"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Seleccionar columnas">
            <IconButton color="primary" onClick={handleOpenColumnSelector}>
              <ViewColumnIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filtrar">
            <IconButton color="primary" onClick={handleOpenFilterDrawer}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar reporte">
            <IconButton color="primary" onClick={handleClickDownload}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorElDownload}
            open={Boolean(anchorElDownload)}
            onClose={handleCloseDownloadMenu}
          >
            <MenuItem onClick={() => handleDownload('pdf')}>PDF</MenuItem>
            <MenuItem onClick={() => handleDownload('excel')}>Excel</MenuItem>
            <MenuItem onClick={() => handleDownload('csv')}>CSV</MenuItem>
          </Menu>

          <Button
            component={Link}
            to={routes[buttonTo]()}
            variant="contained"
            color="success"
            size="small"
            startIcon={
              <Typography sx={{ fontSize: 8, fontWeight: 'bold' }}>
                +
              </Typography>
            }
            sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
          >
            {buttonLabel}
          </Button>
        </Box>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseColumnSelector}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <ColumnSelector onClose={handleCloseColumnSelector} />
        </Popover>

        {/* Panel lateral de filtros */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={handleCloseFilterDrawer}
        >
          <Box sx={{ width: 300, p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Filtros de tabla</Typography>
              <IconButton onClick={handleCloseFilterDrawer}>
                <ArrowBackIcon />
              </IconButton>
            </Box>

            <Box sx={{ my: 2, height: 1, bgcolor: 'divider' }} />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Filtrar
            </Typography>

            {/* Selección del filtro */}
            <TextField
              select
              label="Filtro"
              value={filters.issuedBy || ''}
              onChange={(e) => updateFilter('issuedBy', e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            >
              <MenuItem value="estado">Estado</MenuItem>
              <MenuItem value="fechas">Entre Fechas</MenuItem>
              <MenuItem value="creado_por">Creado por</MenuItem>
              <MenuItem value="modificado_por">Modificado por</MenuItem>
            </TextField>

            {/* Valor del filtro para los casos que no sean fechas */}
            {filters.issuedBy && filters.issuedBy !== 'fechas' && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                  Valor
                </Typography>
                <TextField
                  select
                  label="Seleccionar valor de filtro"
                  value={filters.valor || ''}
                  onChange={(e) => updateFilter('valor', e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="ACTIVO">Activo</MenuItem>
                  <MenuItem value="INACTIVO">Inactivo</MenuItem>
                </TextField>
              </>
            )}

            {/* Selector de fechas cuando se selecciona 'fechas' */}
            {filters.issuedBy === 'fechas' && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                  Seleccionar rango de fechas
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    type="date"
                    label="Fecha de inicio"
                    value={filters.fechaInicio || ''}
                    onChange={(e) =>
                      updateFilter('fechaInicio', e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    type="date"
                    label="Fecha de fin"
                    value={filters.fechaFin || ''}
                    onChange={(e) => updateFilter('fechaFin', e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                </Box>
              </>
            )}

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
            >
              <Button variant="outlined" onClick={clearFilters}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseFilterDrawer}
              >
                Aplicar
              </Button>
            </Box>
          </Box>
        </Drawer>

        {/* Contenido principal */}
        <Box sx={{ mt: 1 }}>
          {typeof children === 'function'
            ? children(search, triggerRefresh, filteredData)
            : children}
        </Box>
      </Container>
    </ColumnConfigProvider>
  )
}

export default AccesoriosLayout

