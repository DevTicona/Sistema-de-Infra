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

import './RolForm.css'

const RolForm = (props) => {
  const { currentUser } = useAuth()
  const [selectedTipos, setSelectedTipos] = useState([])
  const [privilegios, setPrivilegios] = useState({
    'Sistema Operativo': [],
    'Base de Datos': [],
  })
  const [error, setError] = useState('')

  const TIPO_MAP = {
    'Sistema Operativo': 'SO',
    'Base de Datos': 'BD',
  }

  const SIGLA_MAP = {
    SO: 'Sistema Operativo',
    BD: 'Base de Datos',
  }

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

  useEffect(() => {
    if (props.rol) {
      const tiposCompletos = props.rol.tipo
        .split(',')
        .map((t) => t.trim())
        .map((t) => SIGLA_MAP[t] || t)

      setSelectedTipos(tiposCompletos)

      if (props.rol.privilegios) {
        setPrivilegios(props.rol.privilegios)
      }
    }
  }, [props.rol])

  const handleTipoChange = (tipo) => {
    const newTipos = selectedTipos.includes(tipo)
      ? selectedTipos.filter((t) => t !== tipo)
      : [...selectedTipos, tipo]
    setSelectedTipos(newTipos)
  }

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

    if (selectedTipos.length === 0) {
      setError('Debe seleccionar al menos un tipo')
      return
    }

    if (data.get('nombre').length > 15) {
      setError('El nombre no puede exceder los 15 caracteres')
      return
    }

    const tipoMapeado = selectedTipos.map((t) => TIPO_MAP[t] || t).join(', ')

    if (tipoMapeado.length > 15) {
      setError('Combinación de tipos demasiado larga')
      return
    }

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
    <Container maxWidth="md" className="rol-container">
      <Paper elevation={3} className="rol-paper">
        <Typography variant="h4" component="h1" className="rol-title">
          {props.rol ? 'Editar Rol' : 'Crear Nuevo Rol'}
        </Typography>

        {error && (
          <Alert severity="error" className="rol-error-alert">
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit}>
          Nombre
          <TextField
            fullWidth
            name="nombre"
            defaultValue={props.rol?.nombre}
            required
            inputProps={{ maxLength: 15 }}
            className="rol-input"
            InputProps={{ className: "rol-input-field" }}
            InputLabelProps={{ className: "rol-input-label" }}
          />

          <FormControl component="fieldset" className="rol-tipo-container">
            <FormLabel component="legend" className="rol-section-label">
              Tipo
            </FormLabel>
            <FormGroup row className="rol-checkbox-group">
              {Object.keys(PRIVILEGIOS_POR_TIPO).map((tipo) => (
                <FormControlLabel
                  key={tipo}
                  control={
                    <Checkbox
                      checked={selectedTipos.includes(tipo)}
                      onChange={() => handleTipoChange(tipo)}
                      className="rol-checkbox"
                    />
                  }
                  label={tipo}
                  className="rol-checkbox-label"
                />
              ))}
            </FormGroup>
          </FormControl>

          {selectedTipos.length > 0 && (
            <Accordion defaultExpanded className="rol-accordion">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="rol-accordion-summary"
              >
                <Typography variant="h6" className="rol-accordion-title">
                  Privilegios
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="rol-accordion-details">
                <Grid container spacing={3}>
                  {selectedTipos.map((tipo) => (
                    <Grid item xs={12} md={6} key={tipo}>
                      <div className="privilegio-group">
                        <Typography variant="subtitle1" className="privilegio-group-title">
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
                                  className="rol-checkbox"
                                />
                              }
                              label={privilegio}
                              className="rol-checkbox-label"
                            />
                          ))}
                        </FormGroup>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          <FormControl component="fieldset" className="rol-estado-container">
            <FormLabel component="legend" className="rol-section-label">
              Estado
            </FormLabel>
            <RadioGroup
              row
              name="estado"
              defaultValue={props.rol?.estado || 'ACTIVO'}
              className="rol-radio-group"
            >
              <FormControlLabel
                value="ACTIVO"
                control={<Radio className="rol-radio" />}
                label="Activo"
                className="rol-radio-label"
              />
              <FormControlLabel
                value="INACTIVO"
                control={<Radio className="rol-radio" />}
                label="Inactivo"
                className="rol-radio-label"
              />
            </RadioGroup>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            className="rol-submit-button"
            disabled={props.loading}
          >
            {props.loading ? 'Guardando...' : 'Guardar Rol'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default RolForm
