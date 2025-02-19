import { useState } from 'react'

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  SelectField,
  Submit,
} from '@redwoodjs/forms'
import { gql } from '@redwoodjs/graphql-client'
import { useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

// Consulta GraphQL para obtener los sistemas
const OBTENER_SERVIDORES = gql`
  query ObtenerServidores {
    servidors {
      id
      nombre
    }
  }
`
// Consulta GraphQL para obtener los sistemas
const OBTENER_CONTENEDORES = gql`
  query ObtenerContenedores {
    contenedorlogicos {
      id
      nombre
    }
  }
`

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
      <Label className="rw-label">Versión</Label>
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

const ServidorcontenedorForm = (props) => {
  const { currentUser } = useAuth() // Obtén el usuario logueado
  const { data: servidoresData } = useQuery(OBTENER_SERVIDORES)
  const { data: contenedoresData } = useQuery(OBTENER_CONTENEDORES)
  const onSubmit = (data) => {
    const formData = {
      ...data,
      id_servidor: parseInt(data.id_servidor, 10),
      id_contenedor_logico: parseInt(data.id_contenedor_logico, 10),
      respaldo: data.respaldo ? JSON.parse(data.respaldo) : {},
      usuario_modificacion: currentUser?.id, // Asigna el ID del usuario logueado
      usuario_creacion: currentUser?.id, // Asigna el ID si es creación o mantenimiento
    }
    props.onSave(formData, props?.servidorcontenedor?.id)
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
          name="id_servidor"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Servidor
        </Label>
        <SelectField
          name="id_servidor"
          defaultValue={props.servidorcontenedor?.id_servidor || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Seleccione un servidor</option>
          {servidoresData?.servidors?.length > 0 ? (
            servidoresData.servidors.map((servidor) => (
              <option key={servidor.id} value={servidor.id}>
                {servidor.nombre}
              </option>
            ))
          ) : (
            <option disabled>No hay servidores disponibles</option>
          )}
        </SelectField>

        <FieldError name="id_servidor" className="rw-field-error" />

        <Label
          name="id_contenedor_logico"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id contenedor logico
        </Label>

        <SelectField
          name="id_contenedor_logico"
          defaultValue={props.servidorcontenedor?.id_contenedor_logico || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Seleccione un contenedor logico</option>
          {contenedoresData?.contenedorlogicos?.length > 0 ? (
            contenedoresData.contenedorlogicos.map((contenedorlogico) => (
              <option key={contenedorlogico.id} value={contenedorlogico.id}>
                {contenedorlogico.nombre}
              </option>
            ))
          ) : (
            <option disabled>No hay contenedores logicos disponibles</option>
          )}
        </SelectField>

        <FieldError name="id_contenedor_logico" className="rw-field-error" />

        <Label
          name="sigla"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Sigla
        </Label>

        <TextField
          name="sigla"
          defaultValue={props.servidorcontenedor?.sigla}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="sigla" className="rw-field-error" />

        <Label
          name="nombre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nombre
        </Label>

        <TextField
          name="nombre"
          defaultValue={props.servidorcontenedor?.nombre}
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
          defaultValue={props.servidorcontenedor?.descripcion}
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
          defaultValue={props.servidorcontenedor?.tipo}
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
          defaultValue={props.servidorcontenedor?.estado}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="estado" className="rw-field-error" />

        {/* Profile JSON Input */}
        <RespaldoField defaultValue={props.servidorcontenedor?.respaldo} />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ServidorcontenedorForm
