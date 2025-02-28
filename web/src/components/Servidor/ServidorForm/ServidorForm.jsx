import { useState, useEffect } from 'react'

import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  SelectField,
  Submit,
} from '@redwoodjs/forms'
import { useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import PLANTILLAS_METADATA from 'src/plantillas/plantillasMetadata.js'

const OBTENER_DATACENTERS = gql`
  query ObtenerDatacenters {
    datacenters {
      id
      nombre
    }
  }
`

const MetadataField = ({ defaultValue, tipo }) => {
  const [metadataData, setMetadataData] = useState(
    defaultValue || (tipo ? PLANTILLAS_METADATA[tipo] || {} : {})
  )

  // Update metadata template when tipo changes
  useEffect(() => {
    if (tipo) {
      // Keep existing values for fields that exist in both templates
      const newTemplate = PLANTILLAS_METADATA[tipo] || {}
      const mergedData = { ...newTemplate }

      // Preserve existing values when switching templates if the field exists in both
      Object.keys(newTemplate).forEach((key) => {
        if (defaultValue && defaultValue[key]) {
          mergedData[key] = defaultValue[key]
        }
      })

      setMetadataData(mergedData)
    }
  }, [tipo, defaultValue])

  const handleChange = (event) => {
    const { name, value } = event.target
    setMetadataData((prevData) => {
      const updatedData = { ...prevData, [name]: value }
      console.log('Actualizando metadataData:', updatedData)
      return updatedData
    })
  }

  if (!tipo || Object.keys(metadataData).length === 0) {
    return (
      <div className="rw-form-wrapper">
        <p className="text-gray-500 italic">
          Seleccione un tipo de servidor para ver campos adicionales
        </p>
        <input type="hidden" name="metadata" value="{}" />
      </div>
    )
  }

  return (
    <div>
      <div className="rw-form-wrapper mt-4 mb-4">
        <h3 className="font-bold mb-2">Información adicional</h3>
        {Object.keys(metadataData).map((key) => (
          <div key={key} className="mb-2">
            <Label className="rw-label">{key}</Label>
            <TextField
              name={key}
              value={metadataData[key] || ''}
              onChange={handleChange}
              className="rw-input"
            />
          </div>
        ))}
      </div>
      <input
        type="hidden"
        name="metadata"
        value={JSON.stringify(metadataData)}
      />
    </div>
  )
}

const ServidorForm = (props) => {
  const { currentUser } = useAuth()
  const [tipoServidor, setTipoServidor] = useState(props.servidor?.tipo || '')
  const { data: datacentersData } = useQuery(OBTENER_DATACENTERS)

  // Estado para los datos del sistema a editar
  const [formData, setFormData] = useState(props.sistema || {})

  useEffect(() => {
    if (props.sistema) {
      setFormData(props.sistema) // Asegúrate de que el estado se actualice con los datos del sistema
    }
  }, [props.sistema]) // Se actualiza cuando props.sistema cambia

  const onSubmit = (data) => {
    const metadataInput = document.querySelector('input[name="metadata"]')
    const formData = {
      ...data,
      metadata: metadataInput ? JSON.parse(metadataInput.value) : {},
      usuario_modificacion: currentUser?.id,
      usuario_creacion: props.servidor?.id
        ? props.servidor.usuario_creacion
        : currentUser?.id || 1,
    }

    // Convertir id_data_center a número entero si está presente
    if (formData.id_data_center) {
      formData.id_data_center = parseInt(formData.id_data_center, 10)
    }
    props.onSave(formData, props?.servidor?.id)
  }

  const handleTipoChange = (event) => {
    setTipoServidor(event.target.value)
  }

  // Map the server type to metadata template type
  const getMetadataTemplate = (tipo) => {
    switch (tipo) {
      case 'Virtual':
        return 'servidorVirtual'
      case 'Fisico':
        return 'servidorFisico'
      default:
        return null
    }
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
          name="nro_cluster"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nro cluster
        </Label>
        <NumberField
          name="nro_cluster"
          defaultValue={props.servidor?.nro_cluster}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="nro_cluster" className="rw-field-error" />

        <Label
          name="vmid"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Vmid
        </Label>
        <NumberField
          name="vmid"
          defaultValue={props.servidor?.vmid}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="vmid" className="rw-field-error" />

        <Label
          name="nombre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nombre
        </Label>
        <TextField
          name="nombre"
          defaultValue={props.servidor?.nombre}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="nombre" className="rw-field-error" />

        <Label
          name="nodo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nodo
        </Label>
        <TextField
          name="nodo"
          defaultValue={props.servidor?.nodo}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="nodo" className="rw-field-error" />

        <Label
          name="ip"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Ip
        </Label>
        <TextField
          name="ip"
          defaultValue={props.servidor?.ip}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="ip" className="rw-field-error" />

        <Label
          name="tipo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tipo
        </Label>
        <SelectField
          name="tipo"
          defaultValue={props.servidor?.tipo}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          onChange={handleTipoChange}
          required
        >
          <option value="">Seleccione un tipo</option>
          <option value="Virtual">VIRTUAL</option>
          <option value="Fisico">FISICO</option>
        </SelectField>
        <FieldError name="tipo" className="rw-field-error" />

        <Label
          name="estado"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Estado
        </Label>
        <SelectField
          name="estado"
          defaultValue={props.servidor?.estado || 'ACTIVO'}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        >
          {['ACTIVO', 'INACTIVO'].map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </SelectField>
        <FieldError name="estado" className="rw-field-error" />

        <MetadataField
          defaultValue={props.servidor?.metadata}
          tipo={getMetadataTemplate(tipoServidor)}
        />
        <FieldError name="metadata" className="rw-field-error" />

        <Label
          name="id_data_center"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id data center
        </Label>
        <SelectField
          name="id_data_center"
          defaultValue={formData?.id_data_center}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        >
          <option value="">Seleccione un datacenter</option>
          {datacentersData?.datacenters?.length > 0 ? (
            datacentersData.datacenters.map((datacenter) => (
              <option key={datacenter.id} value={String(datacenter.id)}>
                {datacenter.nombre}
              </option>
            ))
          ) : (
            <option disabled>No hay datacenters disponibles</option>
          )}
        </SelectField>
        <FieldError name="id_data_center" className="rw-field-error" />

        <FieldError name="id_padre" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ServidorForm
