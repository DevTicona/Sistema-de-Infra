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
const OBTENER_SISTEMAS = gql`
  query ObtenerSistemas {
    sistemas {
      id
      nombre
    }
  }
`
// Consulta GraphQL para obtener los sistemas
const OBTENER_ENTIDADES = gql`
  query ObtenerEntidades {
    entidads {
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

const SistemaForm = (props) => {
  const { currentUser } = useAuth() // Obtén el usuario logueado
  const { data: sistemasData } = useQuery(OBTENER_SISTEMAS)
  const { data: entidadesData } = useQuery(OBTENER_ENTIDADES)

  const onSubmit = (data) => {
    const formData = {
      ...data,
      id_padre: parseInt(data.id_padre, 10),
      id_entidad: parseInt(data.id_entidad, 10),
      respaldo_creacion: data.respaldo_creacion
        ? JSON.parse(data.respaldo_creacion)
        : {},
      usuario_modificacion: currentUser?.id, // Asigna el ID del usuario logueado
      usuario_creacion: currentUser?.id, // Asigna el ID si es creación o mantenimiento
    }
    props.onSave(formData, props?.sistema?.id)
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

        {/* Selección del sistema */}
        <Label
          name="id_padre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Sistema
        </Label>

        <SelectField
          name="id_padre"
          defaultValue={props.sistema?.id_padre || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        >
          <option value="">Seleccione un sistema</option>
          {sistemasData?.sistemas?.length > 0 ? (
            sistemasData.sistemas.map((sistema) => (
              <option key={sistema.id} value={sistema.id}>
                {sistema.nombre}
              </option>
            ))
          ) : (
            <option disabled>No hay sistemas disponibles</option>
          )}
        </SelectField>

        <FieldError name="id_padre" className="rw-field-error" />

        {/* Otros campos del formulario */}
        <Label
          name="id_entidad"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Entidad
        </Label>
        <SelectField
          name="id_entidad"
          defaultValue={props.sistema?.id_entidad || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Seleccione una entidad</option>
          {entidadesData?.entidads?.length > 0 ? (
            entidadesData.entidads.map((entidad) => (
              <option key={entidad.id} value={entidad.id}>
                {entidad.nombre}
              </option>
            ))
          ) : (
            <option disabled>No hay entidades disponibles</option>
          )}
        </SelectField>
        <FieldError name="id_entidad" className="rw-field-error" />

        <Label
          name="codigo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Codigo
        </Label>

        <TextField
          name="codigo"
          defaultValue={props.sistema?.codigo}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="codigo" className="rw-field-error" />

        <Label
          name="sigla"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Sigla
        </Label>

        <TextField
          name="sigla"
          defaultValue={props.sistema?.sigla}
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
          defaultValue={props.sistema?.nombre}
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
          defaultValue={props.sistema?.descripcion}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="descripcion" className="rw-field-error" />

        <Label
          name="estado"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Estado
        </Label>
        <SelectField
          name="estado"
          defaultValue={props.servidor?.estado}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </SelectField>

        {/* Profile JSON Input */}
        <RespaldoField defaultValue={props.sistema?.respaldo_creacion} />

        {/* Botón de guardar */}
        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Guardar
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default SistemaForm
