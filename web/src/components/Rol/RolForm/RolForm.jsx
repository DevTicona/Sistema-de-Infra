import { useState } from 'react'

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'

import { useAuth } from 'src/auth'

const RespaldoField = ({ defaultValue }) => {
  const [respaldoData, setRespaldoData] = useState(
    defaultValue || {
      descripcion: '',
      permisos: [],
      modulo_asociado: '',
      acceso_remoto: false,
    }
  )

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target
    setRespaldoData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target
    setRespaldoData((prevData) => {
      const permisos = checked
        ? [...prevData.permisos, value] // Añadir el permiso si está marcado
        : prevData.permisos.filter((permiso) => permiso !== value) // Eliminar el permiso si está desmarcado

      return {
        ...prevData,
        permisos, // Actualizar los permisos con el nuevo estado
      }
    })
  }

  return (
    <div>
      <Label className="rw-label">Descripción</Label>
      <TextField
        name="descripcion"
        value={respaldoData.descripcion}
        onChange={handleChange}
        className="rw-input"
      />

      <Label className="rw-label">Permisos</Label>
      <div className="flex gap-4">
        {['lectura', 'escritura', 'ejecucion'].map((permiso) => (
          <label key={permiso} className="flex items-center gap-1">
            <CheckboxField
              name={`permisos`} // Campo único para los permisos
              value={permiso}
              checked={respaldoData.permisos.includes(permiso)}
              onChange={handleCheckboxChange}
            />
            {permiso.charAt(0).toUpperCase() + permiso.slice(1)}
          </label>
        ))}
      </div>

      <Label className="rw-label">Módulo Asociado</Label>
      <TextField
        name="modulo_asociado"
        value={respaldoData.modulo_asociado}
        onChange={handleChange}
        className="rw-input"
      />

      <div className="flex items-center gap-2 mt-4">
        <Label className="rw-label">Acceso Remoto</Label>
        <CheckboxField
          name="acceso_remoto"
          checked={!!respaldoData.acceso_remoto} // Asegura que siempre sea un booleano
          onChange={handleChange}
        />
      </div>
      <input
        type="hidden"
        name="respaldo"
        value={JSON.stringify(respaldoData)} // Convertir los datos del respaldo a JSON
      />
    </div>
  )
}

const RolForm = (props) => {
  const { currentUser } = useAuth() // Obtén el usuario logueado
  const onSubmit = (data) => {
    // Incluir respaldo (el campo JSON de respaldo) en los datos enviados
    const formData = {
      ...data,
      usuario_modificacion: currentUser?.id, // Asigna el ID del usuario logueado
      usuario_creacion: currentUser?.id, // Asigna el ID si es creación o mantenimiento
      respaldo: data.respaldo ? JSON.parse(data.respaldo) : {}, // Parse JSON if it's a string// Parse JSON if it's a string
    }
    props.onSave(formData, props?.rol?.id)
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
