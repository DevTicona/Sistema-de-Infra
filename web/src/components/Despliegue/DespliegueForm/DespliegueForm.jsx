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
import { gql } from '@redwoodjs/graphql-client'
import { useQuery } from '@redwoodjs/web'

// Consulta GraphQL para obtener los sistemas
const OBTENER_COMPONENTES = gql`
  query ObtenerComponentes {
    componentes {
      id
      nombre
    }
  }
`
// Consulta GraphQL para obtener los sistemas
const OBTENER_CONTENEDOR_LOGICO = gql`
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
const DespliegueForm = (props) => {
  const { data: componentesData } = useQuery(OBTENER_COMPONENTES)
  const { data: cotenedoresData } = useQuery(OBTENER_CONTENEDOR_LOGICO)
  const onSubmit = (data) => {
    const formData = {
      ...data,
      id_componente: parseInt(data.id_componente, 10),
      id_contenedor_logico: parseInt(data.id_contenedor_logico, 10),
      respaldo: data.respaldo ? JSON.parse(data.respaldo) : {},
    }
    props.onSave(formData, props?.despliegue?.id)
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
          name="id_componente"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id componente
        </Label>

        <SelectField
          name="id_componente"
          defaultValue={props.despliegue?.id_componente || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Seleccione un componente</option>
          {componentesData?.componentes?.length > 0 ? (
            componentesData.componentes.map((componente) => (
              <option key={componente.id} value={componente.id}>
                {componente.nombre}
              </option>
            ))
          ) : (
            <option disabled>No hay componentes disponibles</option>
          )}
        </SelectField>

        <FieldError name="id_componente" className="rw-field-error" />

        <Label
          name="id_contenedor_logico"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Contenedor logico
        </Label>

        <SelectField
          name="id_contenedor_logico"
          defaultValue={props.despliegue?.id_contenedor_logico || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Seleccione un contenedor logico</option>
          {cotenedoresData?.contenedorlogicos?.length > 0 ? (
            cotenedoresData.contenedorlogicos.map((contenedorlogico) => (
              <option key={contenedorlogico.id} value={contenedorlogico.id}>
                {contenedorlogico.nombre}
              </option>
            ))
          ) : (
            <option disabled>No hay Contenedores logicos disponibles</option>
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
          defaultValue={props.despliegue?.sigla}
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
          defaultValue={props.despliegue?.nombre}
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
          defaultValue={props.despliegue?.descripcion}
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
          defaultValue={props.despliegue?.tipo}
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
          defaultValue={props.despliegue?.estado}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="estado" className="rw-field-error" />

        {/* Profile JSON Input */}
        <RespaldoField defaultValue={props.despliegue?.respaldo} />
        <Label
          name="usuario_creacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario creacion
        </Label>

        <NumberField
          name="usuario_creacion"
          defaultValue={props.despliegue?.usuario_creacion}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="usuario_creacion" className="rw-field-error" />

        <Label
          name="usuario_modificacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario modificacion
        </Label>

        <NumberField
          name="usuario_modificacion"
          defaultValue={props.despliegue?.usuario_modificacion}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="usuario_modificacion" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default DespliegueForm
