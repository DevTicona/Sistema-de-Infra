import { useState } from 'react'

import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import { useAuth } from 'src/auth'
import PLANTILLAS_RESPALDO from 'src/utils/plantillasRespaldo.js'

const RespaldoField = ({ defaultValue, tipo }) => {
  const [respaldoData, setRespaldoData] = useState(
    defaultValue || PLANTILLAS_RESPALDO[tipo] || {}
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setRespaldoData((prevData) => {
      const updatedData = { ...prevData, [name]: value }
      console.log('Actualizando respaldoData:', updatedData)
      return updatedData
    })
  }

  return (
    <div>
      {Object.keys(respaldoData).map((key) => (
        <div key={key}>
          <Label className="rw-label">{key}</Label>
          <TextField
            name={key}
            value={respaldoData[key] || ''}
            onChange={handleChange}
            className="rw-input"
          />
        </div>
      ))}
      <input
        type="hidden"
        name="respaldo"
        value={JSON.stringify(respaldoData)}
      />
      {console.log(
        'Valor en input hidden respaldo:',
        JSON.stringify(respaldoData)
      )}
    </div>
  )
}

const ServidorForm = (props) => {
  const { currentUser } = useAuth() // Obtén el usuario logueado
  const onSubmit = (data) => {
    const respaldoInput = document.querySelector('input[name="respaldo"]')
    const formData = {
      ...data,
      respaldo: respaldoInput ? JSON.parse(respaldoInput.value) : {}, // Asegurar que sea un objeto
      usuario_modificacion: currentUser?.id, // Asigna el ID del usuario logueado
      usuario_creacion: currentUser?.id, // Asigna el ID si es creación o mantenimiento
    }
    console.log('Formulario enviado con respaldo:', formData)
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
        <TextField
          name="estado"
          defaultValue={props.servidor?.estado}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="estado" className="rw-field-error" />

        <RespaldoField
          defaultValue={props.servidor?.respaldo}
          tipo="servidor"
        />

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
