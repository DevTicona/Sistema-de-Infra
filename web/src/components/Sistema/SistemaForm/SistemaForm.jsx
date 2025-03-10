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
import { gql, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

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
    <div className="my-4 p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Datos de Respaldo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rw-input-group">
          <Label>Tipo de Respaldo</Label>
          <TextField
            value={respaldoData.tipo_respaldo}
            onChange={handleChange}
            name="tipo_respaldo"
            className="rw-input"
            placeholder="Ej: Cite oficial"
          />
        </div>

        <div className="rw-input-group">
          <Label>Detalle del Respaldo</Label>
          <TextField
            value={respaldoData.detalle_respaldo}
            onChange={handleChange}
            name="detalle_respaldo"
            className="rw-input"
            placeholder="Ej: AGETIC/UGAT/001"
          />
        </div>

        <div className="rw-input-group">
          <Label>Fecha de Solicitud</Label>
          <TextField
            value={respaldoData.fecha_solicitud}
            onChange={handleChange}
            name="fecha_solicitud"
            className="rw-input"
          />
        </div>

        <div className="rw-input-group">
          <Label>Responsable Administrativo</Label>
          <TextField
            value={respaldoData.responsable_admin}
            onChange={handleChange}
            name="responsable_admin"
            className="rw-input"
            placeholder="Nombre del responsable"
          />
        </div>
      </div>
    </div>
  )
}

const SistemaForm = (props) => {
  const { data: sistemasData, loading: sistemasLoading } =
    useQuery(OBTENER_SISTEMAS)
  const { data: entidadesData, loading: entidadesLoading } =
    useQuery(OBTENER_ENTIDADES)
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
    return <div className="rw-text-center">Cargando datos iniciales...</div>
  }

  return (
    <div className="rw-form-wrapper max-w-3xl mx-auto">
      <Form onSubmit={onSubmit} error={props.error} className="space-y-6">
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper bg-red-50 text-red-600 p-4 rounded mb-4"
          listClassName="list-disc ml-4"
        />

        <div className="rw-input-group">
          <Label>Sistema Padre (Opcional)</Label>
          <SelectField
            name="id_padre"
            defaultValue={props.sistema?.id_padre || ''}
            className="rw-input"
          >
            <option value="">Seleccionar sistema padre...</option>
            {sistemasData?.sistemas.map((sistema) => (
              <option key={sistema.id} value={sistema.id}>
                {sistema.nombre}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="rw-input-group">
          <Label>Entidad*</Label>
          <SelectField
            name="id_entidad"
            defaultValue={props.sistema?.id_entidad || ''}
            className="rw-input"
            validation={{ required: true }}
          >
            <option value="">Seleccionar entidad...</option>
            {entidadesData?.entidads.map((entidad) => (
              <option key={entidad.id} value={entidad.id}>
                {entidad.nombre}
              </option>
            ))}
          </SelectField>
          <FieldError name="id_entidad" className="rw-field-error" />
        </div>

        <div className="rw-input-group">
          <Label>Código*</Label>
          <TextField
            name="codigo"
            defaultValue={props.sistema?.codigo || ''}
            className="rw-input"
            validation={{ required: true }}
            placeholder="Ej: SIS-001"
          />
          <FieldError name="codigo" className="rw-field-error" />
        </div>

        <div className="rw-input-group">
          <Label>Sigla*</Label>
          <TextField
            name="sigla"
            defaultValue={props.sistema?.sigla || ''}
            className="rw-input"
            validation={{ required: true }}
            placeholder="Ej: SIS"
          />
          <FieldError name="sigla" className="rw-field-error" />
        </div>

        <div className="rw-input-group">
          <Label>Nombre del Sistema*</Label>
          <TextField
            name="nombre"
            defaultValue={props.sistema?.nombre || ''}
            className="rw-input"
            validation={{ required: true }}
            placeholder="Ej: Sistema de Gestión Documental"
          />
          <FieldError name="nombre" className="rw-field-error" />
        </div>

        <div className="rw-input-group">
          <Label>Descripción*</Label>
          <TextField
            name="descripcion"
            defaultValue={props.sistema?.descripcion || ''}
            className="rw-input h-32"
            validation={{ required: true }}
            as="textarea"
            placeholder="Descripción detallada del sistema..."
          />
          <FieldError name="descripcion" className="rw-field-error" />
        </div>

        <div className="rw-input-group">
          <Label>Estado*</Label>
          <SelectField
            name="estado"
            defaultValue={props.sistema?.estado || 'ACTIVO'}
            className="rw-input"
            validation={{ required: true }}
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </SelectField>
          <FieldError name="estado" className="rw-field-error" />
        </div>

        <RespaldoField
          defaultValue={respaldoData}
          onRespaldoChange={setRespaldoData}
        />

        <div className="rw-button-group mt-8">
          <Submit className="rw-button rw-button-blue">Guardar Sistema</Submit>
        </div>
      </Form>
    </div>
  )
}

export default SistemaForm
