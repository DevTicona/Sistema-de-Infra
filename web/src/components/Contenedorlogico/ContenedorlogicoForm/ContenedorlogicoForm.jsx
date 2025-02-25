import { useState } from 'react'

import {
  Form,
  FormError,
  FieldError,
  Label,
  SelectField,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import { useAuth } from 'src/auth'

const RespaldoField = ({ defaultValue }) => {
  const [respaldoData, setRespaldoData] = useState(
    defaultValue || { version: '' }
  )

  const handleChange = (event) => {
    setRespaldoData({
      ...respaldoData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <Label className="rw-label">Versión del sistema</Label>
      <TextField
        name="version"
        value={respaldoData.version || ''}
        onChange={handleChange}
        className="rw-input"
      />
      <input
        type="hidden"
        name="respaldo"
        value={JSON.stringify(respaldoData)} // Convertir los datos del respaldo a JSON
      />
    </div>
  )
}

const ContenedorlogicoForm = (props) => {
  const { currentUser } = useAuth() // Obtén el usuario logueado
  const onSubmit = (data) => {
    const formData = {
      ...data,
      usuario_modificacion: currentUser?.id, // Asigna el ID del usuario logueado
      usuario_creacion: currentUser?.id, // Asigna el ID si es creación o mantenimiento
      respaldo: data.respaldo ? JSON.parse(data.respaldo) : {},
    }
    props.onSave(formData, props?.contenedorlogico?.id)
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

        <Label
          name="codigo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Codigo
        </Label>

        <TextField
          name="codigo"
          defaultValue={props.contenedorlogico?.codigo}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="codigo" className="rw-field-error" />

        <Label
          name="nombre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nombre
        </Label>

        <TextField
          name="nombre"
          defaultValue={props.contenedorlogico?.nombre}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="nombre" className="rw-field-error" />

        <Label
          name="descripcion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Descripcion
        </Label>

        <TextField
          name="descripcion"
          defaultValue={props.contenedorlogico?.descripcion}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="descripcion" className="rw-field-error" />

        <Label
          name="tipo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tipo
        </Label>

        <TextField
          name="tipo"
          defaultValue={props.contenedorlogico?.tipo}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="tipo" className="rw-field-error" />

        <SelectField
          name="estado"
          defaultValue={props.contenedorlogico?.estado}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </SelectField>
        {/* Profile JSON Input */}
        <RespaldoField defaultValue={props.contenedorlogico?.respaldo} />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ContenedorlogicoForm
