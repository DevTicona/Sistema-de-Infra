import { useMemo, useEffect, useState } from 'react'

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
} from '@mui/material'
import debounce from 'lodash/debounce'

import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

// Contextos de búsqueda y refresco
import { ColumnConfigProvider } from 'src/context/ColumnConfigContext'
import ColumnSelector from 'src/context/ColumnSelector'
import { useRefresh } from 'src/context/RefreshContext'
import { useSearch } from 'src/context/SearchContext'
import { generateCSVReport } from 'src/lib/generateCSVReport'
import { generateExcelReport } from 'src/lib/generateExcelReport'
import { generatePDFReport } from 'src/lib/generatePDFReport'
const AccesoriosLayout = ({
  title,
  titleTo,
  buttonLabel,
  buttonTo,
  children,
  Datos, // Aquí pasas los datos de los servidores desde Servidors.jsx
  columnsToDisplay, // Pasa las columnas configurables
}) => {
  // Búsqueda y refresco
  const { search, handleSearchChange } = useSearch()
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        handleSearchChange(value)
      }, 300),
    [handleSearchChange]
  )
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const { triggerRefresh } = useRefresh()
  const [loading, setLoading] = useState(false)
  const handleRefresh = () => {
    setLoading(true)
    triggerRefresh()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  // Estado para manejar el menú de descarga
  const [anchorElDownload, setAnchorElDownload] = useState(null)
  const handleClickDownload = (event) => {
    setAnchorElDownload(event.currentTarget)
  }
  const handleCloseDownloadMenu = () => {
    setAnchorElDownload(null)
  }

  // Estado para controlar el popover del selector de columnas
  const [anchorEl, setAnchorEl] = useState(null)
  const handleOpenColumnSelector = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseColumnSelector = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  // Función para manejar la descarga según el tipo
  const handleDownload = (type) => {
    // Log para ver qué contiene columnsToDisplay
    console.log('Tipo de columnsToDisplay:', typeof columnsToDisplay)
    console.log('Valor de columnsToDisplay:', columnsToDisplay)
    // Asegúrate de que columnsToDisplay es un array válido
    if (!Array.isArray(columnsToDisplay)) {
      console.error('Error: columnsToDisplay no es un array:', columnsToDisplay)
      alert(
        'Hubo un error al generar el reporte. Verifica la configuración de las columnas.'
      )
      return
    }
    switch (type) {
      case 'pdf':
        console.log('columnsToDisplay before passing to PDF:', columnsToDisplay)
        generatePDFReport(Datos, columnsToDisplay, title)
        break
      case 'excel':
        generateExcelReport(Datos, columnsToDisplay)
        break
      case 'csv':
        generateCSVReport(Datos)
        break
      default:
        alert('Formato no soportado')
        break
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
            <IconButton color="primary">
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          {/* Botón de descarga con menú */}
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

        {/* Popover para el selector de columnas */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseColumnSelector}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <ColumnSelector onClose={handleCloseColumnSelector} />
        </Popover>

        {/* Contenido principal */}
        <Box sx={{ mt: 1 }}>
          {typeof children === 'function'
            ? children(search, triggerRefresh)
            : children}
        </Box>
      </Container>
    </ColumnConfigProvider>
  )
}

export default AccesoriosLayout
