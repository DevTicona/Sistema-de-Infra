import Select from 'react-select'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
SelectField,
  Controller,
} from '@redwoodjs/forms'
import { useQuery } from '@redwoodjs/web'
import { useAuth } from 'src/auth'

import './DespliegueForm.css'

const OBTENER_COMPONENTES = gql`
  query obtenerComponentes {
    componentes {
      id
      nombre
    }
  }
`

const OBTENER_SERVIDORES = gql`
  query obtenerServidores {
    servidors {
      id
      nombre
    }
  }
`

const DespliegueForm = (props) => {
  const { currentUser } = useAuth()

  const { data: componentesData } = useQuery(OBTENER_COMPONENTES)
  const { data: servidoresData } = useQuery(OBTENER_SERVIDORES)

  const componentesOptions =
    componentesData?.componentes?.map((c) => ({
      value: c.id,
      label: c.nombre,
    })) || []

  const servidoresOptions =
    servidoresData?.servidors?.map((s) => ({
      value: s.id,
      label: s.nombre,
    })) || []

  const onSubmit = (data) => {
    const formData = {
      ...data,
      usuario_modificacion: currentUser?.id,
      usuario_creacion: props.despliegue?.id ? currentUser?.id : currentUser?.id || 1,
    }
    props.onSave(formData, props?.despliegue?.id)
  }

  return (
    <div className="despliegue-form">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError error={props.error} className="form-error" />

        <div className="form-grid">
          {/* Servidor */}
          <div className="form-group">
            <Label className="input-label">Servidor</Label>
            <Controller
              name="id_servidor"
              defaultValue={props.despliegue?.id_servidor}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={servidoresOptions}
                  value={servidoresOptions.find(opt => opt.value === field.value)}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccionar servidor..."
                  classNamePrefix="react-select"
                />
              )}
            />
            <FieldError name="id_servidor" className="error-message" />
          </div>

          {/* Componente */}
          <div className="form-group">
            <Label className="input-label">Componente</Label>
            <Controller
              name="id_componente"
              defaultValue={props.despliegue?.id_componente}
              render={({ field }) => (
                <Select
                  options={componentesOptions}
                  value={componentesOptions.find(opt => opt.value === field.value)}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccionar componente..."
                  classNamePrefix="react-select"
                  isClearable
                />
              )}
            />
            <FieldError name="id_componente" className="error-message" />
          </div>

          {/* Agrupador */}
          <div className="form-group">
            <Label className="input-label">Agrupador</Label>
            <TextField
              name="agrupador"
              defaultValue={props.despliegue?.agrupador}
              className="input-field"
              validation={{ required: true }}
            />
            <FieldError name="agrupador" className="error-message" />
          </div>

          {/* Nombre */}
          <div className="form-group">
            <Label className="input-label">Nombre</Label>
            <TextField
              name="nombre"
              defaultValue={props.despliegue?.nombre}
              className="input-field"
              validation={{ required: true }}
            />
            <FieldError name="nombre" className="error-message" />
          </div>

          {/* Tipo */}
          <div className="form-group">
            <Label className="input-label">Tipo</Label>
            <TextField
              name="tipo"
              defaultValue={props.despliegue?.tipo}
              className="input-field"
              validation={{ required: true }}
            />
            <FieldError name="tipo" className="error-message" />
          </div>

          {/* Estado */}
          <div className="form-group">
                                  <Label className="input-label">Estado</Label>
                                  <SelectField
                                    name="estado"
                                    defaultValue={props.despliegue?.estado || 'ACTIVO'}
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

        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={props.loading}>
            {props.loading ? 'Guardando...' : 'Guardar Despliegue'}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default DespliegueForm
