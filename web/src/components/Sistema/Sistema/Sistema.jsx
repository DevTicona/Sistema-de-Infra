import React from 'react'
import {
  People,
  Code,
  Storage,
  Description,
  Delete,
  Edit,
  Person,
  Info,
  Backup,
  VerifiedUser,
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
  Box,
  Paper,
  Avatar,
} from '@mui/material'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const DELETE_SISTEMA_MUTATION = gql`
  mutation DeleteSistemaMutation($id: Int!) {
    deleteSistema(id: $id) {
      id
    }
  }
`

// Helpers personalizados
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

const Sistema = ({ sistema }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const [deleteSistema] = useMutation(DELETE_SISTEMA_MUTATION, {
    onCompleted: () => {
      toast.success('Sistema eliminado correctamente')
      navigate(routes.sistemas())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleDeleteConfirm = () => {
    deleteSistema({ variables: { id: sistema.id } })
    setDeleteDialogOpen(false)
  }

  const downloadPDF = () => {
    const input = document.getElementById('sistema-content')

    // Pequeño delay para asegurar renderizado
    setTimeout(() => {
      html2canvas(input, {
        scale: 0.8, // Reducir el tamaño del contenido (ajusta este valor según sea necesario)
        useCORS: true,
        logging: true,
        allowTaint: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 1.0)
        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgWidth = 210
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Añadir la primera página
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

        // Guardar el PDF
        pdf.save(`sistema_${sistema.nombre}.pdf`)
      })
    }, 500) // Delay de 500ms
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header con acciones */}
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
            {sistema.nombre?.[0]?.toUpperCase() || 'S'}
          </Avatar>
          <div>
            <Typography
              variant="h4"
              component="h1"
              style={{ fontWeight: 700, color: '#2c3e50' }}
            >
              {sistema.nombre}
            </Typography>
            <Chip
              label={sistema.estado}
              sx={{
                marginTop: '0.5rem',
                backgroundColor:
                  sistema.estado === 'ACTIVO' ? '#e8f5e9 !important' : '#ffebee !important',
                color: sistema.estado === 'ACTIVO' ? '#2e7d32 !important' : '#c62828 !important',
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
            to={routes.editSistema({ id: sistema.id })}
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
      <div id="sistema-content">
        <Grid container spacing={3}>
          {/* Columna Izquierda - Información del Sistema */}
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
                  <Description style={{ marginRight: 8 }} /> Información del
                  Sistema
                </Typography>
                <Divider style={{ margin: '1rem 0' }} />

                <Grid container spacing={2}>

                <DetailItem
                  label="Nombre"
                  value={sistema.nombre}
                  icon={<Info fontSize="small" />}
                />
                <DetailItem
                  label="Estado"
                  value={sistema.estado}
                  icon={<VerifiedUser fontSize="small" />}
                />
                  <DetailItem
                    label="ID Sistema"
                    value={sistema.id}
                    icon={<Info fontSize="small" />}
                  />

                  <DetailItem
                    label="Código"
                    value={sistema.codigo}
                    icon={<Backup fontSize="small" />}
                  />

                  <DetailItem
                    label="Sigla"
                    value={sistema.sigla}
                    icon={<VerifiedUser fontSize="small" />}
                  />

                  <DetailItem
                    label="Sistema Padre"
                    value={sistema.id_padre || 'Ninguno'}
                  />

                  <DetailItem
                    label="Entidad"
                    value={
                      sistema.entidades?.nombre || `ID ${sistema.id_entidad}`
                    }
                  />

                  <DetailItem
                    label="Descripción"
                    value={sistema.descripcion || 'Sin descripción'}
                    fullWidth
                  />

                  <DetailItem
                    label="Creado por"
                    value={sistema.usuario_creacion || 'Desconocido'}
                    icon={<Person fontSize="small" />}
                  />

                  <DetailItem
                    label="Modificado por"
                    value={sistema.usuario_modificacion || 'No modificado'}
                    icon={<Person fontSize="small" />}
                  />

                  <DetailItem
                    label="Fecha Creación"
                    value={formatDate(sistema.fecha_creacion)}
                  />

                  <DetailItem
                    label="Última Modificación"
                    value={
                      sistema.fecha_modificacion
                        ? formatDate(sistema.fecha_modificacion)
                        : 'Nunca modificado'
                    }
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
                          <Description fontSize="small" /> Respaldo Creación
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
                        {formatJSON(sistema.respaldo_creacion)}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Columna Derecha - Responsables */}
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
                  <People style={{ marginRight: 8 }} /> Usuarios
                </Typography>
                <Divider style={{ margin: '1rem 0' }} />

                {sistema.usuario_roles?.length > 0 ? (
                  <List dense>
                    {sistema.usuario_roles.map((rol) => (
                      <ListItem
                        key={rol.id}
                        button
                        component={Link}
                        to={routes.usuario({ id: rol.usuarios?.id })}
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
                          {rol.usuarios?.nombre_usuario?.[0]?.toUpperCase() ||
                            'U'}
                        </Avatar>

                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1" fontWeight={500}>
                                {rol.usuarios?.nombre_usuario ||
                                  'Usuario desconocido'}
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
                    <People sx={{ fontSize: 40, color: '#e0e0e0' }} />
                    <Typography variant="body2" color="textSecondary">
                      No hay usuarios asignados
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Componentes asociados */}
          <Grid item xs={12}>
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
                  <Code style={{ marginRight: 8 }} /> Componentes
                </Typography>
                <Divider style={{ margin: '1rem 0' }} />

                {sistema.componentes?.length > 0 ? (
                  <Grid container spacing={2}>
                    {sistema.componentes.map((componente) => (
                      <Grid item xs={12} sm={6} md={4} key={componente.id}>
                        <Card variant="outlined" style={{ borderRadius: 8 }}>
                          <CardContent style={{ padding: '1rem' }}>
                            <Typography
                              variant="subtitle1"
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <Storage
                                style={{
                                  fontSize: 18,
                                  marginRight: 8,
                                  color: '#757575',
                                }}
                              />
                              <Link
                                to={routes.componente({ id: componente.id })}
                                style={{
                                  color: '#2c3e50',
                                  textDecoration: 'none',
                                }}
                              >
                                {componente.nombre}
                              </Link>
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              style={{ marginTop: 4 }}
                            >
                              Estado:{" "}
                              <Chip
                                label={componente.estado}
                                sx={{
                                  backgroundColor:
                                    componente.estado === "ACTIVO"
                                      ? "#e8f5e9 !important"
                                      : "#ffebee !important",
                                  color:
                                    componente.estado === "ACTIVO"
                                      ? "#2e7d32 !important"
                                      : "#c62828 !important",
                                  fontSize: "0.8rem",
                                  height: 24,
                                }}
                              />
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ textAlign: 'center' }}
                  >
                    No hay componentes asociados
                  </Typography>
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
              ¿Eliminar permanentemente el sistema "{sistema.nombre}"?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Esta acción eliminará todos los registros asociados, incluyendo:
            </Typography>
            <ul style={{ color: '#c62828', margin: '8px 0 0 20px' }}>
              <li>Componentes asociados</li>
              <li>Historial de actividades</li>
              <li>Configuraciones relacionadas</li>
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

// Componente DetailItem
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

export default Sistema
