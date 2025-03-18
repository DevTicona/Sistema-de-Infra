import React from 'react'
import {
  Storage,
  Description,
  Delete,
  Edit,
  Person,
  Info,
  Code,
  Dns,
  Computer,
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
  Avatar,
} from '@mui/material'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const DELETE_COMPONENTE_MUTATION = gql`
  mutation DeleteComponenteMutation($id: Int!) {
    deleteComponente(id: $id) {
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

const Componente = ({ componente }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const [deleteComponente] = useMutation(DELETE_COMPONENTE_MUTATION, {
    onCompleted: () => {
      toast.success('Componente eliminado correctamente')
      navigate(routes.componentes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleDeleteConfirm = () => {
    deleteComponente({ variables: { id: componente.id } })
    setDeleteDialogOpen(false)
  }

  const downloadPDF = () => {
    const input = document.getElementById('componente-content')

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`componente_${componente.nombre}.pdf`)
    })
  }

  if (!componente) {
    return <Typography variant="h6">Cargando...</Typography>
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
            {componente.nombre?.[0]?.toUpperCase() || 'C'}
          </Avatar>
          <div>
            <Typography
              variant="h4"
              component="h1"
              style={{ fontWeight: 700, color: '#2c3e50' }}
            >
              {componente.nombre}
            </Typography>
            <Chip
              label={componente.estado || 'Sin estado'}
              style={{
                marginTop: '0.5rem',
                backgroundColor:
                  componente.estado === 'ACTIVO' ? '#e8f5e9' : '#ffebee',
                color: componente.estado === 'ACTIVO' ? '#2e7d32' : '#c62828',
              }}
            />
          </div>
        </Box>
        <div>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Edit />}
            component={Link}
            to={routes.editComponente({ id: componente.id })}
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
      <div id="componente-content">
        <Grid container spacing={3}>
          {/* Columna Izquierda - Información del Componente */}
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
                  Componente
                </Typography>
                <Divider style={{ margin: '1rem 0' }} />

                <Grid container spacing={2}>
                  <DetailItem
                    label="ID Componente"
                    value={componente.id}
                    icon={<Info fontSize="small" />}
                  />
                  <DetailItem
                    label="Nombre"
                    value={componente.nombre}
                    icon={<Code fontSize="small" />}
                  />
                  <DetailItem
                    label="Descripción"
                    value={componente.descripcion || 'Sin descripción'}
                    fullWidth
                  />
                  <DetailItem
                    label="Estado"
                    value={componente.estado || 'Sin estado'}
                    icon={<Info fontSize="small" />}
                  />
                  <DetailItem
                    label="Entorno"
                    value={componente.entorno || 'Sin entorno'}
                    icon={<Dns fontSize="small" />}
                  />
                  <DetailItem
                    label="Categoría"
                    value={componente.categoria || 'Sin categoría'}
                    icon={<Storage fontSize="small" />}
                  />
                  <DetailItem
                    label="Creado por"
                    value={componente.usuario_creacion || 'Desconocido'}
                    icon={<Person fontSize="small" />}
                  />
                  <DetailItem
                    label="Modificado por"
                    value={componente.usuario_modificacion || 'No modificado'}
                    icon={<Person fontSize="small" />}
                  />
                  <DetailItem
                    label="Fecha Creación"
                    value={formatDate(componente.fecha_creacion)}
                  />
                  <DetailItem
                    label="Última Modificación"
                    value={
                      componente.fecha_modificacion
                        ? formatDate(componente.fecha_modificacion)
                        : 'Nunca modificado'
                    }
                  />
                </Grid>
              </CardContent>
            </Card>

            {/* Sección de Sistemas Asociados */}
            <Card elevation={3} style={{ borderRadius: 16, marginTop: '2rem' }}>
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
                  <Storage style={{ marginRight: 8 }} /> Sistema Asociado
                </Typography>
                <Divider style={{ margin: '1rem 0' }} />

                {componente.sistemas ? (
                  <Button
                    component={Link}
                    to={routes.sistemas({ id: componente.sistemas.id })}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      textAlign: 'left',
                      width: '100%',
                      textTransform: 'none',
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography
                        variant="body1"
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      >
                        {componente.sistemas.nombre || 'Sin nombre'}
                      </Typography>
                      <Chip
                        label={componente.sistemas.estado || 'Sin estado'}
                        size="small"
                        sx={{
                          backgroundColor:
                            componente.sistemas.estado === 'ACTIVO'
                              ? '#e8f5e9'
                              : '#ffebee',
                          color:
                            componente.sistemas.estado === 'ACTIVO'
                              ? '#2e7d32'
                              : '#c62828',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Button>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No hay sistema asociado
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Columna Derecha - Despliegues y Servidores */}
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
                  <Computer style={{ marginRight: 8 }} /> Despliegues y Servidores
                </Typography>
                <Divider style={{ margin: '1rem 0' }} />

                {componente.despliegue?.length > 0 ? (
                  <List dense>
                    {componente.despliegue.map((despliegue) => (
                      <ListItem
                        key={despliegue.id}
                        sx={{
                          p: 2,
                          mb: 1,
                          borderRadius: 2,
                          '&:hover': { backgroundColor: '#f8f9fa' },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" flexDirection="column" gap={1}>
                              Despliegues
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="subtitle2" fontWeight={500}>
                                  Tipo:
                                </Typography>
                                <Chip
                                  label={despliegue.tipo || 'Sin tipo'}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#e3f2fd',
                                    color: '#1e88e5',
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="subtitle2" fontWeight={500}>
                                  Agrupado:
                                </Typography>
                                <Chip
                                  label={despliegue.agrupador || 'Sin agrupador'}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#e3f2fd',
                                    color: '#1e88e5',
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                mt: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 2,
                                  alignItems: 'center',
                                }}
                              >
                                <Chip
                                  label={despliegue.estado || 'Sin estado'}
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      despliegue.estado === 'ACTIVO'
                                        ? '#e8f5e9'
                                        : '#ffebee',
                                    color:
                                      despliegue.estado === 'ACTIVO'
                                        ? '#2e7d32'
                                        : '#c62828',
                                  }}
                                />
                              </Box>
                              Servidor:
                              <Button
                                component={Link}
                                to={routes.servidor({
                                  id: despliegue.servidores.id,
                                })}
                                sx={{
                                  color: 'primary.main',
                                  textDecoration: 'underline',
                                  p: 0,
                                  minWidth: 'auto',
                                  '&:hover': { color: 'primary.dark' },
                                  textTransform: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={
                                    despliegue.servidores.nombre || 'Sin nombre'
                                  }
                                  size="small"
                                  sx={{
                                    backgroundColor: '#e3f2fd',
                                    color: '#1e88e5',
                                    fontWeight: 600,
                                  }}
                                />
                                <Chip
                                  label={
                                    despliegue.servidores.estado || 'Sin estado'
                                  }
                                  size="small"
                                  sx={{
                                    backgroundColor:
                                      despliegue.servidores.estado === 'ACTIVO'
                                        ? '#e8f5e9'
                                        : '#ffebee',
                                    color:
                                      despliegue.servidores.estado === 'ACTIVO'
                                        ? '#2e7d32'
                                        : '#c62828',
                                    fontSize: '0.7rem',
                                    height: 20,
                                  }}
                                />
                              </Button>
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
                      No hay despliegues asociados
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
              ¿Eliminar permanentemente el componente "{componente.nombre}"?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Esta acción eliminará todos los registros asociados, incluyendo:
            </Typography>
            <ul style={{ color: '#c62828', margin: '8px 0 0 20px' }}>
              <li>Despliegues asociados</li>
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
      <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
        {value || '-'}
      </Typography>
    </Box>
  </Grid>
)

export default Componente
