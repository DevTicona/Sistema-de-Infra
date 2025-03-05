import { useState } from 'react'

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
} from '@mui/material'

import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

const ScaffoldLayout = ({
  title,
  titleTo,
  buttonLabel,
  buttonTo,
  children,
}) => {
  const [search, setSearch] = useState('')

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    // Aquí podrías integrar la lógica para filtrar datos en la tabla
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleDownload = (type) => {
    alert(`Descargando reporte en formato: ${type}`)
    // Implementar la generación de reportes PDF o Excel aquí
  }

  return (
    <div
      className="rw-scaffold"
      style={{ position: 'relative', padding: '10px' }}
    >
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />

      <header
        className="rw-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 className="rw-heading rw-heading-primary">
          <Link to={routes[titleTo]()} className="rw-link">
            {title}
          </Link>
        </h1>

        {/* Botón para agregar nuevo */}
        <Link to={routes[buttonTo]()} className="rw-button rw-button-green">
          <div className="rw-button-icon">+</div> {buttonLabel}
        </Link>
      </header>

      {/* Barra de herramientas */}
      <Box display="flex" alignItems="center" gap={1} mt={2} mb={2}>
        {/* Buscar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Buscar"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Refrescar */}
        <Tooltip title="Refrescar">
          <IconButton color="primary" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        {/* Seleccionar columnas */}
        <Tooltip title="Seleccionar columnas">
          <IconButton color="primary">
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>

        {/* Filtrar */}
        <Tooltip title="Filtrar">
          <IconButton color="primary">
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        {/* Descargar reportes */}
        <Tooltip title="Descargar reporte">
          <IconButton color="primary" onClick={() => handleDownload('pdf')}>
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Contenido principal */}
      <main className="rw-main">{children}</main>

      {/* Botón de retroceso en la parte superior derecha */}
      <IconButton
        color="primary"
        onClick={() => window.history.back()}
        sx={{ position: 'absolute', top: 10, right: 10 }}
      >
        <ArrowBackIcon />
      </IconButton>
    </div>
  )
}

export default ScaffoldLayout
