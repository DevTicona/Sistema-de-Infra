import { useState } from 'react'

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'
// Component for structured JSON input for Profile
const RespaldoField = ({ defaultValue }) => {
  // Intenta parsear el valor de respaldo si está presente
  const [respaldoData, setRespaldoData] = useState(() => {
    if (defaultValue) {
      try {
        return JSON.parse(defaultValue)
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }
    return {
      permisos: [],
      descripcion: '',
      modulo_asociado: '',
      configuracion_especial: {
        restricciones_horarias: '',
        acceso_remoto: false,
      },
    }
  })

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    if (type === 'checkbox') {
      setRespaldoData((prev) => ({
        ...prev,
        permisos: checked
          ? [...prev.permisos, value]
          : prev.permisos.filter((permiso) => permiso !== value),
      }))
    } else if (name.startsWith('configuracion_especial')) {
      const fieldName = name.split('.').pop()
      setRespaldoData((prev) => ({
        ...prev,
        configuracion_especial: {
          ...prev.configuracion_especial,
          [fieldName]: value,
        },
      }))
    } else {
      setRespaldoData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <div>
      <Label className="rw-label">Descripción</Label>
      <TextField
        name="descripcion"
        value={respaldoData.descripcion || ''}
        onChange={handleChange}
        className="rw-input"
      />

      <Label className="rw-label">Módulo Asociado</Label>
      <TextField
        name="modulo_asociado"
        value={respaldoData.modulo_asociado || ''}
        onChange={handleChange}
        className="rw-input"
      />

      <Label className="rw-label">Permisos</Label>
      <div>
        {['crear', 'editar', 'eliminar'].map((permiso) => (
          <label key={permiso} className="block">
            <CheckboxField
              name="permisos"
              value={permiso}
              checked={respaldoData.permisos.includes(permiso)}
              onChange={handleChange}
            />
            {permiso}
          </label>
        ))}
      </div>

      <Label className="rw-label">Restricciones Horarias</Label>
      <TextField
        name="configuracion_especial.restricciones_horarias"
        value={respaldoData.configuracion_especial.restricciones_horarias || ''}
        onChange={handleChange}
        className="rw-input"
      />

      <Label className="rw-label">Acceso Remoto</Label>
      <CheckboxField
        name="configuracion_especial.acceso_remoto"
        checked={respaldoData.configuracion_especial.acceso_remoto || false}
        onChange={handleChange}
      />

      {/* Campo oculto para enviar el JSON como respaldo */}
      <input
        type="hidden"
        name="respaldo"
        value={JSON.stringify(respaldoData)}
      />
    </div>
  )
}

const RolForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.rol?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        {/* Campo Nombre */}
        <Label
          name="nombre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nombre
        </Label>
        <TextField
          name="nombre"
          defaultValue={props.rol?.nombre || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="nombre" className="rw-field-error" />

        {/* Campo Tipo */}
        <Label
          name="tipo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tipo
        </Label>
        <TextField
          name="tipo"
          defaultValue={props.rol?.tipo || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="tipo" className="rw-field-error" />

        {/* Campo Estado */}
        <Label
          name="estado"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Estado
        </Label>
        <TextField
          name="estado"
          defaultValue={props.rol?.estado || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="estado" className="rw-field-error" />

        {/* Respaldo JSON Input */}
        <RespaldoField defaultValue={props.rol?.respaldo} />

        {/* Campo Usuario Creacion */}
        <Label
          name="usuario_creacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario Creacion
        </Label>
        <NumberField
          name="usuario_creacion"
          defaultValue={props.rol?.usuario_creacion || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="usuario_creacion" className="rw-field-error" />

        {/* Campo Usuario Modificacion */}
        <Label
          name="usuario_modificacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario Modificacion
        </Label>
        <NumberField
          name="usuario_modificacion"
          defaultValue={props.rol?.usuario_modificacion || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />
        <FieldError name="usuario_modificacion" className="rw-field-error" />

        {/* Botón de Envío */}
        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default RolForm
