import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IconButton } from '@mui/material'

import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

const ScaffoldLayout = ({
  title,
  titleTo,
  buttonLabel,
  buttonTo,
  children,
}) => {
  return (
    <div className="rw-scaffold" style={{ position: 'relative' }}>
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link to={routes[titleTo]()} className="rw-link">
            {title}
          </Link>
        </h1>
        <Link to={routes[buttonTo]()} className="rw-button rw-button-green">
          <div className="rw-button-icon">+</div> {buttonLabel}
        </Link>
      </header>

      <main className="rw-main">{children}</main>

      {/* Botón de retroceso en la parte superior derecha */}
      <IconButton
        color="primary"
        onClick={() => window.history.back()}
        sx={{ position: 'absolute', top: 10, right: 0 }}
      >
        <ArrowBackIcon />
      </IconButton>
    </div>
  )
}

export default ScaffoldLayout
