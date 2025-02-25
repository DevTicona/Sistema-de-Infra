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

// Component for structured JSON input for Profile
const ProfileField = ({ defaultValue }) => {
  const [profileData, setProfileData] = useState(
    defaultValue ? defaultValue : { nombre: '', apellido: '' }
  )

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <Label className="rw-label">Nombre</Label>
      <TextField
        name="nombre"
        value={profileData.nombre}
        onChange={handleChange}
        className="rw-input"
      />
      <Label className="rw-label">Apellido</Label>
      <TextField
        name="apellido"
        value={profileData.apellido}
        onChange={handleChange}
        className="rw-input"
      />
      {/* Send profile data as JSON */}
      <input type="hidden" name="profile" value={JSON.stringify(profileData)} />
    </div>
  )
}

// Component for structured JSON input for Telefono
const TelefonoField = ({ defaultValue }) => {
  const [telefonoData, setTelefonoData] = useState(
    defaultValue ? defaultValue : { movil: '', fijo: '' }
  )

  const handleChange = (event) => {
    setTelefonoData({
      ...telefonoData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <Label className="rw-label">Móvil</Label>
      <TextField
        name="movil"
        value={telefonoData.movil}
        onChange={handleChange}
        className="rw-input"
      />
      <Label className="rw-label">Fijo</Label>
      <TextField
        name="fijo"
        value={telefonoData.fijo}
        onChange={handleChange}
        className="rw-input"
      />
      {/* Send telefono data as JSON */}
      <input
        type="hidden"
        name="telefono"
        value={JSON.stringify(telefonoData)}
      />
    </div>
  )
}

// Component for structured JSON input for Correo Electronico
const CorreoElectronicoField = ({ defaultValue }) => {
  const [correoData, setCorreoData] = useState(
    defaultValue ? defaultValue : { personal: '', trabajo: '' }
  )

  const handleChange = (event) => {
    setCorreoData({
      ...correoData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <Label className="rw-label">Correo Personal</Label>
      <TextField
        name="personal"
        value={correoData.personal}
        onChange={handleChange}
        className="rw-input"
      />
      <Label className="rw-label">Correo Trabajo</Label>
      <TextField
        name="trabajo"
        value={correoData.trabajo}
        onChange={handleChange}
        className="rw-input"
      />
      {/* Send correo data as JSON */}
      <input
        type="hidden"
        name="correo_electronico"
        value={JSON.stringify(correoData)}
      />
    </div>
  )
}

const UsuarioForm = (props) => {
  const { currentUser } = useAuth() // Obtén el usuario logueado
  const onSubmit = (data) => {
    // Asegurarse de que los campos profile, telefono y correo_electronico se envíen como objetos
    const formData = {
      ...data,
      profile: data.profile ? JSON.parse(data.profile) : {}, // Parse JSON if it's a string
      telefono: data.telefono ? JSON.parse(data.telefono) : {}, // Parse JSON if it's a string
      correo_electronico: data.correo_electronico
        ? JSON.parse(data.correo_electronico)
        : {}, // Parse JSON if it's a string
      usuario_modificacion: currentUser?.id, // Asigna el ID del usuario logueado
      usuario_creacion: currentUser?.id, // Asigna el ID si es creación o mantenimiento
    }

    // Enviar los datos al servidor
    props.onSave(formData, props?.usuario?.id)
  }

  return (
    <div className="rw-form-wrapper max-w-sm mx-auto bg-white p-3 rounded-lg shadow-md">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="uuid_ciudadano"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Uuid ciudadano
        </Label>

        <TextField
          name="uuid_ciudadano"
          defaultValue={props.usuario?.uuid_ciudadano}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="uuid_ciudadano" className="rw-field-error" />

        <Label
          name="nombre_usuario"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nombre usuario
        </Label>

        <TextField
          name="nombre_usuario"
          defaultValue={props.usuario?.nombre_usuario}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="nombre_usuario" className="rw-field-error" />

        {/* Profile JSON Input */}
        <ProfileField defaultValue={props.usuario?.profile} />

        {/* Telefono JSON Input */}
        <TelefonoField defaultValue={props.usuario?.telefono} />

        {/* Correo Electronico JSON Input */}
        <CorreoElectronicoField
          defaultValue={props.usuario?.correo_electronico}
        />

        <Label
          name="estado"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Estado
        </Label>
        <SelectField
          name="estado"
          defaultValue={props.usuario?.estado}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </SelectField>
        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default UsuarioForm
