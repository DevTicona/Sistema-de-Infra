import React from 'react'
import {
  Storage,
  Delete,
  Edit,
  Person,
  Info,
  Cloud,
  Dns,
  Category,
  GroupWork,
  ExpandMore,
  ExpandLess,
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
  Divider,
  Box,
  Paper,
  Avatar,
  Link,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
} from '@mui/material'
import { routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const JsonViewer = ({ data }) => {
  const [expanded, setExpanded] = React.useState(false)

  if (!data) return <Typography variant="body2">No hay metadatos</Typography>

  const formattedData = typeof data === 'string' ? JSON.parse(data) : data

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="subtitle2">Ver Metadata</Typography>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <List dense sx={{ mt: 1 }}>
          {Object.entries(formattedData).map(([key, value]) => (
            <ListItem key={key} sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, minWidth: 150 }}
                    >
                      {key}:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#616161' }}>
                      {JSON.stringify(value, null, 2)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  )
}

const Servidor = ({ servidor }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedComponente, setSelectedComponente] = React.useState(null)

  const [deleteServidor] = useMutation(DELETE_SERVIDOR_MUTATION, {
    onCompleted: () => {
      toast.success('Servidor eliminado correctamente')
      navigate(routes.servidors())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleDeleteConfirm = () => {
    deleteServidor({ variables: { id: servidor.id } })
    setDeleteDialogOpen(false)
  }

  const handleComponenteClick = (componente) => {
    setSelectedComponente(componente)
  }

  const downloadPDF = () => {
    const input = document.getElementById('servidor-content')

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
      pdf.save(`servidor_${servidor.nombre}.pdf`)
    })
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header con acciones */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
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
            {servidor.nombre?.[0]?.toUpperCase() || 'S'}
          </Avatar>
          <div>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, color: '#2c3e50' }}
            >
              {servidor.nombre}
            </Typography>
            <Chip
              label={servidor.estado}
              sx={{
                mt: 1,
                backgroundColor:
                  servidor.estado === 'ACTIVO' ? '#e8f5e9' : '#ffebee',
                color: servidor.estado === 'ACTIVO' ? '#2e7d32' : '#c62828',
              }}
            />
          </div>
        </Box>
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={() => navigate(routes.editServidor({ id: servidor.id }))}
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
      </Box>

      {/* Contenido para el PDF */}
      <div id="servidor-content">
        <Grid container spacing={3}>
          {/* Sección de Información del Servidor */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ borderRadius: 8 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', color: '#3f51b5' }}
                >
                  <Dns sx={{ mr: 1 }} /> Información del Servidor
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <DetailItem label="ID" value={servidor.id} icon={<Info />} />
                  <DetailItem
                    label="Nro Cluster"
                    value={servidor.nro_cluster}
                    icon={<GroupWork />}
                  />
                  <DetailItem
                    label="VMID"
                    value={servidor.vmid}
                    icon={<Storage />}
                  />
                  <DetailItem label="Nombre" value={servidor.nombre} />
                  <DetailItem
                    label="Nodo"
                    value={servidor.nodo}
                    icon={<Cloud />}
                  />
                  <DetailItem
                    label="IP"
                    value={servidor.ip}
                    icon={<Category />}
                  />
                  <DetailItem label="Tipo" value={servidor.tipo} />
                  <DetailItem label="Estado" value={servidor.estado} />

                  {/* Campo Metadata mejorado */}
                  <Grid item xs={12}>
                    <JsonViewer data={servidor.metadata} />
                  </Grid>

                  <DetailItem
                    label="Usuario Creación"
                    value={servidor.usuario_creacion}
                  />
                  <DetailItem
                    label="Usuario Modificación"
                    value={servidor.usuario_modificacion || 'N/A'}
                  />
                  <DetailItem
                    label="Fecha Creación"
                    value={formatDate(servidor.fecha_creacion)}
                  />
                  <DetailItem
                    label="Fecha Modificación"
                    value={
                      servidor.fecha_modificacion
                        ? formatDate(servidor.fecha_modificacion)
                        : 'Nunca modificado'
                    }
                  />
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sección de Datacenter y Despliegue */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ borderRadius: 8, height: '100%' }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', color: '#3f51b5' }}
                >
                  <Cloud sx={{ mr: 1 }} /> Ubicación y Configuración
                </Typography>
                <Divider sx={{ my: 2 }} />

                <DetailItem
                  label="Datacenter"
                  value={servidor.data_centers?.nombre || 'No asignado'}
                  fullWidth
                />

                {servidor.despliegue.length > 0 ? (
                  servidor.despliegue.map((despliegue, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{ mb: 1 }}
                      >
                        Despliegue {index + 1}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={`Tipo: ${despliegue.tipo}`}
                          sx={{ backgroundColor: '#e3f2fd', color: '#1e88e5' }}
                        />
                        <Chip
                          label={`Agrupador: ${despliegue.agrupador}`}
                          sx={{ backgroundColor: '#f3e5f5', color: '#9c27b0' }}
                        />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No hay configuraciones de despliegue
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sección de Componentes Asociados */}
          <Grid item xs={12}>
            <Card elevation={3} sx={{ borderRadius: 8 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', color: '#3f51b5' }}
                >
                  <Category sx={{ mr: 1 }} /> Componentes Asociados
                </Typography>
                <Divider sx={{ my: 2 }} />

                {servidor.despliegue.some((d) => d.componentes) ? (
                  <Grid container spacing={2}>
                    {servidor.despliegue.map(
                      (despliegue) =>
                        despliegue.componentes && (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={despliegue.componentes.id}
                          >
                            <Card
                              variant="outlined"
                              sx={{
                                borderRadius: 8,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  boxShadow: 2,
                                  transform: 'translateY(-2px)',
                                  borderColor: '#3f51b5',
                                },
                              }}
                              onClick={() =>
                                handleComponenteClick(despliegue.componentes)
                              }
                            >
                              <CardContent>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': { color: '#3f51b5' },
                                  }}
                                >
                                  <Storage
                                    sx={{ fontSize: 18, mr: 1, color: '#757575' }}
                                  />
                                  {despliegue.componentes.nombre}
                                </Typography>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                  <Chip
                                    label={despliegue.componentes.entorno}
                                    size="small"
                                    sx={{
                                      backgroundColor: '#e8f5e9',
                                      color: '#2e7d32',
                                    }}
                                  />
                                  <Chip
                                    label={despliegue.componentes.categoria}
                                    size="small"
                                    sx={{
                                      backgroundColor: '#e3f2fd',
                                      color: '#1e88e5',
                                    }}
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                    )}
                  </Grid>
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign="center"
                  >
                    No hay componentes asociados
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sección de Detalle del Componente Seleccionado */}
          {selectedComponente && (
            <Grid item xs={12}>
              <Card elevation={3} sx={{ borderRadius: 8, mt: 3 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#3f51b5',
                    }}
                  >
                    <Storage sx={{ mr: 1 }} /> Detalle del Componente
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <DetailItem label="ID" value={selectedComponente.id} />
                    <DetailItem
                      label="Nombre"
                      value={selectedComponente.nombre}
                    />
                    <DetailItem
                      label="Descripción"
                      value={selectedComponente.descripcion}
                    />
                    <DetailItem
                      label="Estado"
                      value={selectedComponente.estado}
                    />
                    <DetailItem
                      label="Entorno"
                      value={selectedComponente.entorno}
                    />
                    <DetailItem
                      label="Categoría"
                      value={selectedComponente.categoria}
                    />
                    <DetailItem
                      label="Fecha Creación"
                      value={formatDate(selectedComponente.fecha_creacion)}
                    />
                    <DetailItem
                      label="Fecha Modificación"
                      value={
                        selectedComponente.fecha_modificacion
                          ? formatDate(selectedComponente.fecha_modificacion)
                          : 'Nunca modificado'
                      }
                    />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </div>

      {/* Diálogo de Confirmación de Eliminación */}
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
              ¿Eliminar permanentemente el servidor "{servidor.nombre}"?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Esta acción eliminará todos los registros asociados, incluyendo:
            </Typography>
            <ul style={{ color: '#c62828', margin: '8px 0 0 20px' }}>
              <li>Configuraciones de despliegue</li>
              <li>Relación con componentes</li>
              <li>Historial de modificaciones</li>
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

// Componente DetailItem reutilizable
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
        height: '100%',
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {icon && React.cloneElement(icon, { fontSize: 'small' })}
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

export default Servidor
