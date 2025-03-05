import { useState, useEffect } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Container,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Grid,
  Paper,
  FormGroup,
  FormLabel,
  FormControl,
  Alert,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'

import { useAuth } from 'src/auth'

const RolForm = (props) => {
  const { currentUser } = useAuth()
  const [selectedTipos, setSelectedTipos] = useState([])
  const [privilegios, setPrivilegios] = useState({
    'Sistema Operativo': [],
    'Base de Datos': [],
  })
  const [error, setError] = useState('')

  // Mapeo de tipos a siglas
  const TIPO_MAP = {
    'Sistema Operativo': 'SO',
    'Base de Datos': 'BD',
  }

  // Mapeo inverso de siglas a tipos
  const SIGLA_MAP = {
    SO: 'Sistema Operativo',
    BD: 'Base de Datos',
  }

  // Opciones de privilegios por tipo
  const PRIVILEGIOS_POR_TIPO = {
    'Sistema Operativo': [
      'Root (Superusuario)',
      'Usuario Administrador',
      'Usuario Estándar',
      'Usuario Restringido',
    ],
    'Base de Datos': [
      'Administrador en Base de Datos',
      'Desarrollo en Base de Datos',
      'Editor de Datos',
      'Lectura de Datos',
    ],
  }

  // Inicializar estado cuando hay datos existentes
  useEffect(() => {
    if (props.rol) {
      // Convertir siglas a nombres completos
      const tiposCompletos = props.rol.tipo
        .split(',')
        .map((t) => t.trim())
        .map((t) => SIGLA_MAP[t] || t)

      setSelectedTipos(tiposCompletos)

      // Parsear privilegios
      if (props.rol.privilegios) {
        setPrivilegios(props.rol.privilegios)
      }
    }
  }, [props.rol])

  // Manejar selección de tipos
  const handleTipoChange = (tipo) => {
    const newTipos = selectedTipos.includes(tipo)
      ? selectedTipos.filter((t) => t !== tipo)
      : [...selectedTipos, tipo]
    setSelectedTipos(newTipos)
  }

  // Manejar selección de privilegios
  const handlePrivilegioChange = (tipo, privilegio) => {
    const newPrivilegios = { ...privilegios }
    newPrivilegios[tipo] = newPrivilegios[tipo].includes(privilegio)
      ? newPrivilegios[tipo].filter((p) => p !== privilegio)
      : [...newPrivilegios[tipo], privilegio]
    setPrivilegios(newPrivilegios)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    // Validaciones
    if (selectedTipos.length === 0) {
      setError('Debe seleccionar al menos un tipo')
      return
    }

    if (data.get('nombre').length > 15) {
      setError('El nombre no puede exceder los 15 caracteres')
      return
    }

    // Convertir tipos a siglas
    const tipoMapeado = selectedTipos.map((t) => TIPO_MAP[t] || t).join(', ')

    if (tipoMapeado.length > 15) {
      setError('Combinación de tipos demasiado larga')
      return
    }

    // Preparar datos para enviar
    const formData = {
      nombre: data.get('nombre'),
      tipo: tipoMapeado,
      estado: data.get('estado'),
      privilegios: {
        'Sistema Operativo': selectedTipos.includes('Sistema Operativo')
          ? privilegios['Sistema Operativo']
          : [],
        'Base de Datos': selectedTipos.includes('Base de Datos')
          ? privilegios['Base de Datos']
          : [],
      },
      usuario_modificacion: currentUser?.id,
      usuario_creacion: props.rol?.usuario_creacion || currentUser?.id || 1,
    }

    props.onSave(formData, props?.rol?.id)
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {props.rol ? 'Editar Rol' : 'Crear Nuevo Rol'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit}>
          {/* Campo Nombre */}
          <TextField
            fullWidth
            margin="normal"
            label="Nombre (máx. 15 caracteres)"
            name="nombre"
            defaultValue={props.rol?.nombre}
            required
            inputProps={{ maxLength: 15 }}
          />

          {/* Selector de Tipos */}
          <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
            <FormLabel component="legend">Tipo</FormLabel>
            <FormGroup row>
              {Object.keys(PRIVILEGIOS_POR_TIPO).map((tipo) => (
                <FormControlLabel
                  key={tipo}
                  control={
                    <Checkbox
                      checked={selectedTipos.includes(tipo)}
                      onChange={() => handleTipoChange(tipo)}
                    />
                  }
                  label={tipo}
                />
              ))}
            </FormGroup>
          </FormControl>

          {/* Selector de Privilegios */}
          {selectedTipos.length > 0 && (
            <Accordion defaultExpanded sx={{ mb: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Privilegios</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {selectedTipos.map((tipo) => (
                    <Grid item xs={12} md={6} key={tipo}>
                      <Typography variant="subtitle1" gutterBottom>
                        {tipo}
                      </Typography>
                      <FormGroup>
                        {PRIVILEGIOS_POR_TIPO[tipo].map((privilegio) => (
                          <FormControlLabel
                            key={privilegio}
                            control={
                              <Checkbox
                                checked={privilegios[tipo].includes(privilegio)}
                                onChange={() =>
                                  handlePrivilegioChange(tipo, privilegio)
                                }
                              />
                            }
                            label={privilegio}
                          />
                        ))}
                      </FormGroup>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Campo Estado */}
          <FormControl component="fieldset" sx={{ mt: 2, mb: 3 }}>
            <FormLabel component="legend">Estado</FormLabel>
            <RadioGroup
              row
              name="estado"
              defaultValue={props.rol?.estado || 'ACTIVO'}
            >
              <FormControlLabel
                value="ACTIVO"
                control={<Radio />}
                label="Activo"
              />
              <FormControlLabel
                value="INACTIVO"
                control={<Radio />}
                label="Inactivo"
              />
            </RadioGroup>
          </FormControl>

          {/* Botón de Guardar */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={props.loading}
          >
            Guardar
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default RolForm
