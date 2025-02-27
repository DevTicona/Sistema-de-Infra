import { useState } from 'react'

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

import { useAuth } from 'src/auth'
import PLANTILLAS_METADATA from 'src/plantillas/plantillasMetadata.js'

const MetadataField = ({ defaultValue, tipo }) => {
  const [metadataData, setMetadataData] = useState(
    defaultValue || PLANTILLAS_METADATA[tipo] || {}
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setMetadataData((prevData) => {
      const updatedData = { ...prevData, [name]: value }
      console.log('Actualizando metadataData:', updatedData)
      return updatedData
    })
  }

  return (
    <div>
      {Object.keys(metadataData).map((key) => (
        <div key={key}>
          <Label className="rw-label">{key}</Label>
          <TextField
            name={key}
            value={metadataData[key] || ''}
            onChange={handleChange}
            className="rw-input"
          />
        </div>
      ))}
      <input
        type="hidden"
        name="metadata"
        value={JSON.stringify(metadataData)}
      />
      {console.log(
        'Valor en input hidden metadata:',
        JSON.stringify(metadataData)
      )}
    </div>
  )
}

const ServidorForm = (props) => {
  const { currentUser } = useAuth()
  const onSubmit = (data) => {
    const metadataInput = document.querySelector('input[name="metadata"]')
    const formData = {
      ...data,
      metadata: metadataInput ? JSON.parse(metadataInput.value) : {},
      usuario_modificacion: currentUser?.id,
      usuario_creacion: currentUser?.id,
    }
    props.onSave(formData, props?.servidor?.id)
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
        <TextField
          name="tipo"
          defaultValue={props.servidor?.tipo}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
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
          defaultValue={props.componente?.estado || 'ACTIVO'}
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
          tipo="servidorVirtual"
        />
        <FieldError name="metadata" className="rw-field-error" />

        <Label
          name="id_data_center"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id data center
        </Label>
        <NumberField
          name="id_data_center"
          defaultValue={props.servidor?.id_data_center}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />
        <FieldError name="id_data_center" className="rw-field-error" />

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
