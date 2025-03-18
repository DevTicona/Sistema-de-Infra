import React from 'react'
import {
  Description,
  Delete,
  Edit,
  Person,
  Info,
  VerifiedUser,
  CloudDownload,
  Security,
  AssignmentInd,
  ExpandMore,
} from '@mui/icons-material'
import {
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Paper,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const DELETE_ROL_MUTATION = gql`
  mutation DeleteRolMutation($id: Int!) {
    deleteRol(id: $id) {
      id
    }
  }
`

const SIGLA_MAP = {
  SO: 'Sistema Operativo',
  BD: 'Base de Datos',
}

const PRIVILEGES_COLORS = {
  'Root (Superusuario)': '#d32f2f',
  'Usuario Administrador': '#1976d2',
  'Usuario Estándar': '#388e3c',
  'Usuario Restringido': '#f57c00',
  'Administrador en Base de Datos': '#7b1fa2',
  'Desarrollo en Base de Datos': '#0097a7',
  'Editor de Datos': '#afb42b',
  'Lectura de Datos': '#5d4037',
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatPrivileges = (privilegios) => {
  if (!privilegios) return 'No disponible'
  return Object.entries(privilegios).map(([tipo, valores]) => (
    <div key={tipo} style={{ marginBottom: '1rem' }}>
      <Typography variant="subtitle2" sx={{ color: '#616161', mb: 1 }}>
        {SIGLA_MAP[tipo] || tipo}:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {valores.map((privilegio) => (
          <Chip
            key={privilegio}
            label={privilegio}
            size="small"
            sx={{
              backgroundColor: PRIVILEGES_COLORS[privilegio] || '#e0e0e0',
              color: 'white',
              fontWeight: 500,
            }}
          />
        ))}
      </Box>
    </div>
  ))
}

const Rol = ({ rol }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const [deleteRol] = useMutation(DELETE_ROL_MUTATION, {
    onCompleted: () => {
      toast.success('Rol eliminado correctamente')
      navigate(routes.rols())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleDeleteConfirm = () => {
    deleteRol({ variables: { id: rol.id } })
    setDeleteDialogOpen(false)
  }

  const downloadPDF = () => {
    const input = document.getElementById('rol-content')

    setTimeout(() => {
      html2canvas(input, { scale: 0.8 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        pdf.save(`rol_${rol.nombre}.pdf`)
      })
    }, 500)
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{
            width: 56,
            height: 56,
            bgcolor: '#7b1fa2',
            fontSize: '1.5rem'
          }}>
            {rol.nombre?.[0]?.toUpperCase() || 'R'}
          </Avatar>
          <div>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
              {rol.nombre}
            </Typography>
            <Chip
              label={rol.estado}
              sx={{
                mt: 1,
                backgroundColor: rol.estado === 'ACTIVO' ? '#e8f5e9' : '#ffebee',
                color: rol.estado === 'ACTIVO' ? '#2e7d32' : '#c62828',
              }}
            />
          </div>
        </Box>
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            component={Link}
            to={routes.editRol({ id: rol.id })}
            sx={{ mr: 2 }}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudDownload />}
            onClick={downloadPDF}
            sx={{ mr: 2 }}
          >
            PDF
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Eliminar
          </Button>
        </div>
      </Box>

      {/* Contenido PDF */}
      <div id="rol-content">
        <Grid container spacing={3}>
          {/* Columna Izquierda */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#7b1fa2' }}>
                  <Security sx={{ mr: 1 }} /> Información del Rol
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <DetailItem label="ID" value={rol.id} icon={<Info />} />
                  <DetailItem label="Nombre" value={rol.nombre} icon={<AssignmentInd />} />
                  <DetailItem
                    label="Tipo"
                    value={rol.tipo.split(',').map(t => SIGLA_MAP[t.trim()]).join(', ')}
                    icon={<ExpandMore />}
                  />
                  <DetailItem
                    label="Fecha Creación"
                    value={formatDate(rol.fecha_creacion)}
                  />
                  <DetailItem
                    label="Última Modificación"
                    value={rol.fecha_modificacion ? formatDate(rol.fecha_modificacion) : 'Nunca modificado'}
                  />
                  <DetailItem
                    label="Creado por"
                    value={rol.usuario_creacion || 'Desconocido'}
                    icon={<Person />}
                  />
                  <DetailItem
                    label="Modificado por"
                    value={rol.usuario_modificacion || 'No modificado'}
                    icon={<Person />}
                  />
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Columna Derecha - Privilegios */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ borderRadius: 4, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#7b1fa2' }}>
                  <VerifiedUser sx={{ mr: 1 }} /> Privilegios
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Accordion defaultExpanded sx={{ boxShadow: 'none' }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">Detalle de privilegios</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {formatPrivileges(rol.privilegios)}
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Diálogo Eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ bgcolor: '#f3e5f5', color: '#4a148c' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Delete color="error" /> Confirmar Eliminación
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              ¿Eliminar permanentemente el rol "{rol.nombre}"?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Esta acción afectará a todos los usuarios asociados con este rol.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#f3e5f5' }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            startIcon={<Delete />}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

// Componente DetailItem reutilizable
const DetailItem = ({ label, value, icon }) => (
  <Grid item xs={12}>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      bgcolor: '#f8f9fa',
      borderRadius: 2,
      mb: 1
    }}>
      {icon && React.cloneElement(icon, { sx: { color: '#7b1fa2' } })}
      <Box>
        <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#2c3e50' }}>
          {value || '-'}
        </Typography>
      </Box>
    </Box>
  </Grid>
)

export default Rol
