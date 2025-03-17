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
import { Person, Phone, Email, Lock } from '@mui/icons-material'

import './UsuarioForm.css'

// Componente para datos de perfil
const ProfileField = ({ defaultValue }) => {
  const [profileData, setProfileData] = useState(
    defaultValue || { nombre: '', apellido: '' }
  )

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  return (
    <div className="form-section">
      <div className="section-header">
        <Person className="section-icon" />
        <h3>Información Personal</h3>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <Label className="input-label">Nombre</Label>
          <TextField
            name="nombre"
            value={profileData.nombre}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <Label className="input-label">Apellido</Label>
          <TextField
            name="apellido"
            value={profileData.apellido}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>
      <input type="hidden" name="profile" value={JSON.stringify(profileData)} />
    </div>
  )
}

// Componente para datos de teléfono
const TelefonoField = ({ defaultValue }) => {
  const [telefonoData, setTelefonoData] = useState(
    defaultValue || { movil: '', fijo: '' }
  )

  const handleChange = (e) => {
    setTelefonoData({ ...telefonoData, [e.target.name]: e.target.value })
  }

  return (
    <div className="form-section">
      <div className="section-header">
        <Phone className="section-icon" />
        <h3>Contacto Telefónico</h3>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <Label className="input-label">Móvil</Label>
          <TextField
            name="movil"
            value={telefonoData.movil}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <Label className="input-label">Fijo</Label>
          <TextField
            name="fijo"
            value={telefonoData.fijo}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>
      <input type="hidden" name="telefono" value={JSON.stringify(telefonoData)} />
    </div>
  )
}

// Componente para datos de correo
const CorreoElectronicoField = ({ defaultValue }) => {
  const [correoData, setCorreoData] = useState(
    defaultValue || { personal: '', trabajo: '' }
  )

  const handleChange = (e) => {
    setCorreoData({ ...correoData, [e.target.name]: e.target.value })
  }

  return (
    <div className="form-section">
      <div className="section-header">
        <Email className="section-icon" />
        <h3>Correos Electrónicos</h3>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <Label className="input-label">Personal</Label>
          <TextField
            name="personal"
            value={correoData.personal}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <Label className="input-label">Trabajo</Label>
          <TextField
            name="trabajo"
            value={correoData.trabajo}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>
      <input type="hidden" name="correo_electronico" value={JSON.stringify(correoData)} />
    </div>
  )
}

const UsuarioForm = (props) => {
  const { currentUser } = useAuth()

  const onSubmit = (data) => {
    const formData = {
      ...data,
      profile: data.profile ? JSON.parse(data.profile) : {},
      telefono: data.telefono ? JSON.parse(data.telefono) : {},
      correo_electronico: data.correo_electronico ? JSON.parse(data.correo_electronico) : {},
      usuario_modificacion: currentUser?.id,
      usuario_creacion: props.usuario?.usuario_creacion || currentUser?.id || 1,
    }
    props.onSave(formData, props?.usuario?.id)
  }

  return (
    <div className="usuario-form">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError error={props.error} className="form-error" />

        <div className="form-section">
          <div className="section-header">
            <Lock className="section-icon" />
            <h3>Datos de Cuenta</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <Label className="input-label">UUID Ciudadano</Label>
              <TextField
                name="uuid_ciudadano"
                defaultValue={props.usuario?.uuid_ciudadano}
                className="input-field"
              />
              <FieldError name="uuid_ciudadano" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Nombre de Usuario</Label>
              <TextField
                name="nombre_usuario"
                defaultValue={props.usuario?.nombre_usuario}
                className="input-field"
                validation={{ required: true }}
              />
              <FieldError name="nombre_usuario" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Estado</Label>
              <SelectField
                name="estado"
                defaultValue={props.usuario?.estado || 'ACTIVO'}
                className="input-field"
                validation={{ required: true }}
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </SelectField>
              <FieldError name="estado" className="error-message" />
            </div>
          </div>
        </div>

        <ProfileField defaultValue={props.usuario?.profile} />
        <TelefonoField defaultValue={props.usuario?.telefono} />
        <CorreoElectronicoField defaultValue={props.usuario?.correo_electronico} />

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={props.loading}>
            {props.loading ? 'Guardando...' : 'Guardar Usuario'}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default UsuarioForm
