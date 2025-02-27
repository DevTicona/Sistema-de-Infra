import { useState, useEffect } from 'react'

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

// Consulta GraphQL para obtener las entidades
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
    Array.isArray(defaultValue)
      ? defaultValue
      : [
          {
            tipo_respaldo: '',
            detalle_respaldo: '',
            fecha_solicitud: '',
            responsable_admin: '',
          },
        ]
  )

  const handleChange = (event, index) => {
    const { name, value } = event.target
    const updatedData = [...respaldoData]
    updatedData[index] = {
      ...updatedData[index],
      [name]: value,
    }
    setRespaldoData(updatedData)
  }

  const handleAddRespaldo = () => {
    setRespaldoData([
      ...respaldoData,
      {
        tipo_respaldo: '',
        detalle_respaldo: '',
        fecha_solicitud: '',
        responsable_admin: '',
      },
    ])
  }

  return (
    <div>
      <Label className="rw-label">Respaldo del sistema</Label>
      {respaldoData.map((respaldo, index) => (
        <div key={index} className="respaldo-row">
          <div className="rw-input-group">
            <Label className="rw-label">Tipo de Respaldo</Label>
            <TextField
              name="tipo_respaldo"
              value={respaldo.tipo_respaldo || ''}
              onChange={(e) => handleChange(e, index)}
              className="rw-input"
            />
          </div>

          <div className="rw-input-group">
            <Label className="rw-label">Detalle del Respaldo</Label>
            <TextField
              name="detalle_respaldo"
              value={respaldo.detalle_respaldo || ''}
              onChange={(e) => handleChange(e, index)}
              className="rw-input"
            />
          </div>

          <div className="rw-input-group">
            <Label className="rw-label">Fecha de Solicitud</Label>
            <TextField
              name="fecha_solicitud"
              value={respaldo.fecha_solicitud || ''}
              onChange={(e) => handleChange(e, index)}
              className="rw-input"
            />
          </div>

          <div className="rw-input-group">
            <Label className="rw-label">Responsable Administrativo</Label>
            <TextField
              name="responsable_admin"
              value={respaldo.responsable_admin || ''}
              onChange={(e) => handleChange(e, index)}
              className="rw-input"
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={handleAddRespaldo} className="rw-button">
        Agregar Respaldo
      </button>

      <input
        type="hidden"
        name="respaldo_creacion"
        value={JSON.stringify(respaldoData)}
      />
    </div>
  )
}

const SistemaForm = (props) => {
  const { currentUser } = useAuth() // Obtén el usuario logueado
  const { data: sistemasData } = useQuery(OBTENER_SISTEMAS)
  const { data: entidadesData } = useQuery(OBTENER_ENTIDADES)

  // Estado para los datos del sistema a editar
  const [formData, setFormData] = useState(props.sistema || {})

  useEffect(() => {
    if (props.sistema) {
      setFormData(props.sistema) // Asegúrate de que el estado se actualice con los datos del sistema
    }
  }, [props.sistema]) // Se actualiza cuando props.sistema cambia

  const onSubmit = (data) => {
    const formData = {
      ...data,
      id_padre: parseInt(data.id_padre, 10),
      id_entidad: parseInt(data.id_entidad, 10),
      respaldo_creacion: data.respaldo_creacion
        ? JSON.parse(data.respaldo_creacion) // Convierte el JSON a objeto
        : [],
      usuario_modificacion: currentUser?.id, // Asigna el ID del usuario logueado
      usuario_creacion: 1, // Asigna el ID si es creación o mantenimiento
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
          defaultValue={formData?.id_padre || ''}
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

        {/* Selección de la entidad */}
        <Label
          name="id_entidad"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Entidad
        </Label>
        <SelectField
          name="id_entidad"
          defaultValue={formData?.id_entidad || ''}
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

        {/* Campos adicionales del formulario */}
        <Label
          name="codigo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Código
        </Label>
        <TextField
          name="codigo"
          defaultValue={formData?.codigo || ''}
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
          defaultValue={formData?.sigla || ''}
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
          defaultValue={formData?.nombre || ''}
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
          Descripción
        </Label>
        <TextField
          name="descripcion"
          defaultValue={formData?.descripcion || ''}
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
          defaultValue={formData?.estado || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </SelectField>
        <FieldError name="estado" className="rw-field-error" />

        <RespaldoField defaultValue={formData?.respaldo_creacion || []} />

        <div className="rw-button-group">
          <Submit className="rw-button rw-button-blue">Guardar</Submit>
        </div>
      </Form>
    </div>
  )
}

export default SistemaForm
