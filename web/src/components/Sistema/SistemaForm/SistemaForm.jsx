import { useState } from 'react'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  SelectField,
} from '@redwoodjs/forms'
import { useQuery } from '@redwoodjs/web'
import { useAuth } from 'src/auth'
import { Save, Loader, Shield, Folder, FileText, User } from 'react-feather'

import './SistemaForm.css'

const OBTENER_SISTEMAS = gql`
  query ObtenerSistemas {
    sistemas {
      id
      nombre
    }
  }
`

const OBTENER_ENTIDADES = gql`
  query ObtenerEntidades {
    entidads {
      id
      nombre
    }
  }
`

const RespaldoField = ({ defaultValue, onRespaldoChange }) => {
  const [respaldoData, setRespaldoData] = useState(
    defaultValue || {
      tipo_respaldo: '',
      detalle_respaldo: '',
      fecha_solicitud: '',
      responsable_admin: '',
    }
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    const newData = { ...respaldoData, [name]: value }
    setRespaldoData(newData)
    onRespaldoChange(newData)
  }

  return (
    <div className="respaldo-section">
      <div className="section-header">
        <FileText size={24} className="section-icon" />
        <h3>Datos de Respaldo</h3>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <Label className="input-label">Tipo de Respaldo</Label>
          <TextField
            value={respaldoData.tipo_respaldo}
            onChange={handleChange}
            name="tipo_respaldo"
            className="input-field"
            placeholder="Ej: Cite oficial"
          />
        </div>

        <div className="form-group">
          <Label className="input-label">Detalle del Respaldo</Label>
          <TextField
            value={respaldoData.detalle_respaldo}
            onChange={handleChange}
            name="detalle_respaldo"
            className="input-field"
            placeholder="Ej: AGETIC/UGAT/001"
          />
        </div>

        <div className="form-group">
          <Label className="input-label">Fecha de Solicitud</Label>
          <TextField

            value={respaldoData.fecha_solicitud}
            onChange={handleChange}
            name="fecha_solicitud"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <Label className="input-label">Responsable Administrativo</Label>
          <TextField
            value={respaldoData.responsable_admin}
            onChange={handleChange}
            name="responsable_admin"
            className="input-field"
            placeholder="Nombre del responsable"
          />
        </div>
      </div>
    </div>
  )
}

const SistemaForm = (props) => {
  const { data: sistemasData, loading: sistemasLoading } = useQuery(OBTENER_SISTEMAS)
  const { data: entidadesData, loading: entidadesLoading } = useQuery(OBTENER_ENTIDADES)
  const { currentUser } = useAuth()

  const [respaldoData, setRespaldoData] = useState(
    props.sistema?.respaldo_creacion || {
      tipo_respaldo: '',
      detalle_respaldo: '',
      fecha_solicitud: '',
      responsable_admin: '',
    }
  )

  const onSubmit = (formData) => {
    const submissionData = {
      ...formData,
      id_padre: formData.id_padre ? parseInt(formData.id_padre, 10) : null,
      id_entidad: parseInt(formData.id_entidad, 10),
      respaldo_creacion: respaldoData,
      usuario_modificacion: currentUser?.id,
      usuario_creacion: props.sistema?.usuario_creacion || currentUser?.id || 1,
    }

    props.onSave(submissionData, props.sistema?.id)
  }

  if (sistemasLoading || entidadesLoading) {
    return (
      <div className="loading-container">
        <Loader className="loading-spinner" />
        <span>Cargando datos iniciales...</span>
      </div>
    )
  }

  return (
    <div className="sistema-form">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="form-error"
          titleClassName="error-title"
        />

        <div className="form-section">
          <div className="section-header">
            <Folder size={24} className="section-icon" />
            <h3>Información General</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <Label className="input-label">Sistema Padre (Opcional)</Label>
              <SelectField
                name="id_padre"
                defaultValue={props.sistema?.id_padre || ''}
                className="input-field select-field"
              >
                <option value="">Seleccionar sistema padre...</option>
                {sistemasData?.sistemas.map((sistema) => (
                  <option key={sistema.id} value={sistema.id}>
                    {sistema.nombre}
                  </option>
                ))}
              </SelectField>
            </div>

            <div className="form-group">
              <Label className="input-label">Entidad</Label>
              <SelectField
                name="id_entidad"
                defaultValue={props.sistema?.id_entidad || ''}
                className="input-field select-field"
                validation={{ required: true }}
              >
                <option value="">Seleccionar entidad...</option>
                {entidadesData?.entidads.map((entidad) => (
                  <option key={entidad.id} value={entidad.id}>
                    {entidad.nombre}
                  </option>
                ))}
              </SelectField>
              <FieldError name="id_entidad" className="error-message" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <Shield size={24} className="section-icon" />
            <h3>Detalles del Sistema</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <Label className="input-label">Código</Label>
              <TextField
                name="codigo"
                defaultValue={props.sistema?.codigo || ''}
                className="input-field"
                validation={{ required: true }}
                placeholder="Ej: SIS-001"
              />
              <FieldError name="codigo" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Sigla</Label>
              <TextField
                name="sigla"
                defaultValue={props.sistema?.sigla || ''}
                className="input-field"
                validation={{ required: true }}
                placeholder="Ej: SIS"
              />
              <FieldError name="sigla" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Nombre del Sistema</Label>
              <TextField
                name="nombre"
                defaultValue={props.sistema?.nombre || ''}
                className="input-field"
                validation={{ required: true }}
                placeholder="Ej: Sistema de Gestión Documental"
              />
              <FieldError name="nombre" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Estado</Label>
              <SelectField
                name="estado"
                defaultValue={props.sistema?.estado || 'ACTIVO'}
                className="input-field select-field"
                validation={{ required: true }}
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>

              </SelectField>
              <FieldError name="estado" className="error-message" />
            </div>
          </div>

          <div className="form-group">
            <Label className="input-label">Descripción</Label>
            <TextField
              name="descripcion"
              defaultValue={props.sistema?.descripcion || ''}
              className="input-field textarea-field"
              validation={{ required: true }}

              placeholder="Descripción detallada del sistema..."
            />
            <FieldError name="descripcion" className="error-message" />
          </div>
        </div>

        <RespaldoField
          defaultValue={respaldoData}
          onRespaldoChange={setRespaldoData}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={props.loading}
          >
            {props.loading ? (
              <>
                <Loader className="loading-spinner" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>{props.sistema?.id ? 'Actualizar' : 'Crear Sistema'}</span>
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default SistemaForm
