import { useState, useEffect } from 'react'
import { useQuery } from '@redwoodjs/web'
import { useAuth } from 'src/auth'
import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  SelectField,
} from '@redwoodjs/forms'
import PLANTILLAS_METADATA from 'src/plantillas/plantillasMetadata.js'
import { Server, Cpu, Cloud, Save, Loader } from 'react-feather'

import './ServidorForm.css'

const OBTENER_DATACENTERS = gql`
  query ObtenerDatacenters {
    datacenters {
      id
      nombre
    }
  }
`

const MetadataField = ({ defaultValue, tipo, isEditMode }) => {
  const [metadataData, setMetadataData] = useState({})

  // Efecto para manejar cambios en el tipo y valores iniciales
  useEffect(() => {
    if (tipo) {
      const template = PLANTILLAS_METADATA[tipo] || {}

      // En modo edición, mezclar valores existentes con el template
      // En creación, usar template limpio
      const initialData = isEditMode
        ? { ...template, ...defaultValue }
        : { ...template }

      // Filtrar solo las claves del template actual
      const filteredData = Object.keys(template).reduce((acc, key) => {
        acc[key] = initialData[key] || ''
        return acc
      }, {})

      setMetadataData(filteredData)
    }
  }, [tipo, defaultValue, isEditMode])

  const handleChange = (event) => {
    const { name, value } = event.target
    setMetadataData(prev => ({ ...prev, [name]: value }))
  }

  if (!tipo || !Object.keys(metadataData).length) {
    return (
      <div className="form-section">
        <div className="section-header">
          <Cloud size={24} className="section-icon" />
          <h3>Configuración Avanzada</h3>
        </div>
        <p className="section-description">
          Seleccione un tipo de servidor para habilitar parámetros específicos
        </p>
        <input type="hidden" name="metadata" value="{}" />
      </div>
    )
  }

  return (
    <div className="form-section">
      <div className="section-header">
        <Cpu size={24} className="section-icon" />
        <h3>Especificaciones Técnicas</h3>
      </div>
      <div className="form-grid">
        {Object.keys(metadataData).map((key) => (
          <div className="form-group" key={key}>
            <Label className="input-label">{key}</Label>
            <TextField
              name={key}
              value={metadataData[key]}
              onChange={handleChange}
              className="input-field"
              placeholder={`Ingrese ${key.toLowerCase()}`}
            />
            <FieldError name={key} className="error-message" />
          </div>
        ))}
      </div>
      <input type="hidden" name="metadata" value={JSON.stringify(metadataData)} />
    </div>
  )
}

const ServidorForm = ({ servidor, onSave, error, loading }) => {
  const { currentUser } = useAuth()
  const { data: datacentersData } = useQuery(OBTENER_DATACENTERS)
  const [tipoServidor, setTipoServidor] = useState(servidor?.tipo || '')
  const isEditMode = !!servidor?.id

  const getMetadataTemplateType = (tipo) => {
    return tipo === 'Virtual' ? 'servidorVirtual' :
           tipo === 'Fisico' ? 'servidorFisico' : null
  }

  const handleTipoChange = (e) => {
    if (!isEditMode) {
      setTipoServidor(e.target.value)
    }
  }

  const onSubmit = (data) => {
    const metadataInput = document.querySelector('input[name="metadata"]')
    const formData = {
      ...data,
      id_data_center: parseInt(data.id_data_center, 10),
      metadata: metadataInput ? JSON.parse(metadataInput.value) : {},
      usuario_modificacion: currentUser?.id,
      usuario_creacion: isEditMode ? servidor.usuario_creacion : currentUser?.id || 1,
    }
    onSave(formData, servidor?.id)
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} error={error}>
        <FormError error={error} className="form-error" />

        <div className="form-section">
          <div className="section-header">
            <Server size={24} className="section-icon" />
            <h3>Información Básica</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <Label className="input-label">Número de Cluster</Label>
              <NumberField
                name="nro_cluster"
                defaultValue={servidor?.nro_cluster}
                className="input-field"
                placeholder="Ej: 123"
                validation={{ required: true }}
              />
              <FieldError name="nro_cluster" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">VM Identifier</Label>
              <NumberField
                name="vmid"
                defaultValue={servidor?.vmid}
                className="input-field"
                placeholder="Ej: 4567"
                validation={{ required: true }}
              />
              <FieldError name="vmid" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Nombre del Servidor</Label>
              <TextField
                name="nombre"
                defaultValue={servidor?.nombre}
                className="input-field"
                placeholder="Ej: servidor-prod-01"
                validation={{ required: true }}
              />
              <FieldError name="nombre" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Nodo Asignado</Label>
              <TextField
                name="nodo"
                defaultValue={servidor?.nodo}
                className="input-field"
                placeholder="Ej: nodo-principal"
                validation={{ required: true }}
              />
              <FieldError name="nodo" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Dirección IP</Label>
              <TextField
                name="ip"
                defaultValue={servidor?.ip}
                className="input-field"
                placeholder="Ej: 192.168.1.1"
                validation={{ required: true }}
              />
              <FieldError name="ip" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Tipo de Servidor</Label>
              <SelectField
                name="tipo"
                value={tipoServidor}
                onChange={handleTipoChange}
                disabled={isEditMode}
                className="input-field select-field"
                validation={{ required: true }}
              >
                <option value="">Seleccione Tipo...</option>
                <option value="Virtual">Virtual</option>
                <option value="Fisico">Físico</option>
              </SelectField>
              <FieldError name="tipo" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Estado Actual</Label>
              <SelectField
                name="estado"
                defaultValue={servidor?.estado || 'ACTIVO'}
                className="input-field select-field"
                validation={{ required: true }}
              >
                {['ACTIVO', 'INACTIVO'].map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0) + estado.slice(1).toLowerCase()}
                  </option>
                ))}
              </SelectField>
              <FieldError name="estado" className="error-message" />
            </div>

            <div className="form-group">
              <Label className="input-label">Data Center</Label>
              <SelectField
                name="id_data_center"
                defaultValue={servidor?.id_data_center?.toString()}
                className="input-field select-field"
                validation={{ required: true }}
              >
                <option value="">Seleccione Ubicación...</option>
                {datacentersData?.datacenters?.map((dc) => (
                  <option key={dc.id} value={dc.id.toString()}>
                    {dc.nombre}
                  </option>
                ))}
              </SelectField>
              <FieldError name="id_data_center" className="error-message" />
            </div>
          </div>
        </div>

        <MetadataField
          defaultValue={servidor?.metadata}
          tipo={getMetadataTemplateType(tipoServidor)}
          isEditMode={isEditMode}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="loading-spinner" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>{isEditMode ? 'Actualizar' : 'Crear Servidor'}</span>
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default ServidorForm
