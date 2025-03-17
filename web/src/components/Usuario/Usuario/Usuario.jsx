import React from 'react'
import {
  Person,
  Info,
  Delete,
  Edit,
  Computer,
  Lock,
  ContactPhone,
  AlternateEmail,
  CloudDownload, // Nuevo icono para descargar
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
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Paper,
  Box,
} from '@mui/material'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const DELETE_USUARIO_MUTATION = gql`
  mutation DeleteUsuarioMutation($id: Int!) {
    deleteUsuario(id: $id) {
      id
    }
  }
`

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatJSON = (data) => {
  if (!data) return 'No disponible'
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data
    return Object.entries(parsed).map(([key, value]) => (
      <div
        key={key}
        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
      >
        <span style={{ fontWeight: 500, color: '#3f51b5' }}>{key}:</span>
        <span>{value || '-'}</span>
      </div>
    ))
  } catch {
    return 'Formato inválido'
  }
}

const Usuario = ({ usuario }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const [deleteUsuario] = useMutation(DELETE_USUARIO_MUTATION, {
    onCompleted: () => {
      toast.success('Usuario eliminado')
      navigate(routes.usuarios())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleDeleteConfirm = () => {
    deleteUsuario({ variables: { id: usuario.id } })
    setDeleteDialogOpen(false)
  }

  const downloadPDF = () => {
    const input = document.getElementById('usuario-content')

    // Pequeño delay para asegurar renderizado
    setTimeout(() => {
      html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 1.0)
        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        pdf.save(`usuario_${usuario.nombre_usuario}.pdf`)
      })
    }, 500) // Delay de 500ms
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Encabezado */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: '#3f51b5',
              fontSize: '1.5rem',
            }}
          >
            {usuario.nombre_usuario?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <div>
            <Typography
              variant="h4"
              component="h1"
              style={{ fontWeight: 700, color: '#2c3e50' }}
            >
              {usuario.nombre_usuario}
            </Typography>
            <Chip
              label={usuario.estado}
              sx={{
                marginTop: '0.5rem',
                backgroundColor:
                  usuario.estado === 'ACTIVO' ? '#e8f5e9 !important' : '#ffebee !important',
                color: usuario.estado === 'ACTIVO' ? '#2e7d32 !important' : '#c62828 !important',
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
            to={routes.editUsuario({ id: usuario.id })}
            style={{ marginRight: '1rem' }}
          >
            Editar
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudDownload />}
            onClick={downloadPDF}
            style={{ marginRight: '1rem' }}
          >
            Descargar PDF
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
      </div>

      {/* Contenido para el PDF */}
      <div id="usuario-content">
        <Grid container spacing={3}>
          {/* Columna Izquierda - Información del Usuario */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} style={{ borderRadius: 16 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#3f51b5',
                  }}
                >
                  <Person style={{ marginRight: 8 }} /> Información del Usuario
                </Typography>
                <Divider style={{ margin: '1rem 0' }} />

                <Grid container spacing={2}>
                  <DetailItem
                    label="ID Único"
                    value={usuario.id}
                    icon={<Lock fontSize="small" />}
                  />

                  <DetailItem
                    label="UUID Ciudadano"
                    value={
                      usuario.uuid_ciudadano
                        ? `${usuario.uuid_ciudadano.slice(0)}`
                        : 'No registrado'
                    }
                    icon={<Info fontSize="small" />}
                  />

                  <DetailItem
                    label="Contacto"
                    value={
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <ContactPhone fontSize="small" />
                          {formatJSON(usuario.telefono)}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <AlternateEmail fontSize="small" />
                          {formatJSON(usuario.correo_electronico)}
                        </div>
                      </Box>
                    }
                    fullWidth
                  />

                  <DetailItem
                    label="Historial"
                    value={
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <div>
                          <Typography variant="caption">Creación</Typography>
                          <Typography>
                            {formatDate(usuario.fecha_creacion)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            por: {usuario.usuario_creacion || 'Sistema'}
                          </Typography>
                        </div>
                        {usuario.fecha_modificacion && (
                          <div>
                            <Typography variant="caption">
                              Última modificación
                            </Typography>
                            <Typography>
                              {formatDate(usuario.fecha_modificacion)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              por: {usuario.usuario_modificacion}
                            </Typography>
                          </div>
                        )}
                      </Box>
                    }
                    fullWidth
                  />

                  <Grid item xs={12}>
                    <Paper
                      variant="outlined"
                      style={{ padding: '1rem', marginTop: '1rem' }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        gutterBottom
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person fontSize="small" /> Perfil Completo
                        </Box>
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: '4px',
                          padding: '1rem',
                          maxHeight: '300px',
                          overflowY: 'auto',
                        }}
                      >
                        {formatJSON(usuario.profile)}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Columna Derecha - Sistemas Asociados */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} style={{ borderRadius: 16, height: '100%' }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#3f51b5',
                  }}
                >
                  <Computer style={{ marginRight: 8 }} /> Sistemas y Roles
                  Asignados
                </Typography>
                <Divider style={{ margin: '1rem 0' }} />

                {usuario.usuario_roles?.length > 0 ? (
                  <List dense>
                    {usuario.usuario_roles.map((rol) => (
                      <ListItem
                        key={rol.id}
                        button
                        component={Link}
                        to={routes.sistema({ id: rol.sistemas?.id })}
                        style={{
                          padding: '12px',
                          margin: '4px 0',
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: '#f8f9fa',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#3f51b5',
                            fontSize: '1rem',
                            marginRight: 2,
                          }}
                        >
                          {rol.sistemas?.nombre?.[0]?.toUpperCase() || 'S'}
                        </Avatar>

                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1" fontWeight={500}>
                                {rol.sistemas?.nombre || 'Sistema no encontrado'}
                              </Typography>
                              <Chip
                                label={rol.roles?.nombre}
                                size="small"
                                sx={{
                                  backgroundColor: '#e3f2fd',
                                  color: '#1e88e5',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mt: 1,
                              }}
                            >
                              <Chip
                                label={rol.estado}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    rol.estado === 'ACTIVO'
                                      ? '#e8f5e9 !important'
                                      : '#ffebee !important',
                                  color:
                                    rol.estado === 'ACTIVO'
                                      ? '#2e7d32 !important'
                                      : '#c62828 !important',
                                }}
                              />
                              <Typography variant="caption" color="textSecondary">
                                Asignado el: {formatDate(rol.fecha_creacion)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 4,
                      gap: 2,
                    }}
                  >
                    <Computer sx={{ fontSize: 40, color: '#e0e0e0' }} />
                    <Typography variant="body2" color="textSecondary">
                      No tiene sistemas asociados
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Diálogo de Confirmación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ color: '#c62828', bgcolor: '#fff3e0' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Delete color="error" /> Confirmar Eliminación
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              ¿Eliminar permanentemente a {usuario.nombre_usuario}?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Esta acción eliminará todos los registros asociados, incluyendo:
            </Typography>
            <ul style={{ color: '#c62828', margin: '8px 0 0 20px' }}>
              <li>Asignaciones de roles</li>
              <li>Historial de actividades</li>
              <li>Configuraciones personalizadas</li>
            </ul>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#fff3e0' }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={{ boxShadow: 'none' }}
          >
            Confirmar Eliminación
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

// Componente DetailItem mejorado
const DetailItem = ({ label, value, icon, fullWidth = false }) => (
  <Grid item xs={12} sm={fullWidth ? 12 : 6}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        p: 1.5,
        bgcolor: '#f8f9fa',
        borderRadius: 1,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{ wordBreak: 'break-word', color: '#2c3e50' }}
      >
        {value || '-'}
      </Typography>
    </Box>
  </Grid>
)

export default Usuario
