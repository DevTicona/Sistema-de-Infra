import Select from 'react-select'

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  SelectField,
  Submit,
  Controller,
} from '@redwoodjs/forms'
import { useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

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

  // Consultas para obtener los datos
  const { data: componentesData } = useQuery(OBTENER_COMPONENTES)
  const { data: servidoresData } = useQuery(OBTENER_SERVIDORES)

  // Preparar opciones para los selects
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
      usuario_creacion: props.despliegue?.id
        ? currentUser?.id
        : currentUser?.id || 1,
    }
    props.onSave(formData, props?.despliegue?.id)
  }

  // Estilos personalizados para los selects
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderColor: '#e2e8f0',
      borderRadius: '0.375rem',
      '&:hover': { borderColor: '#cbd5e0' },
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? '#f8fafc' : 'white',
      color: '#1e293b',
    }),
  }

  return (
    <div className="rw-form-wrapper max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <div className="space-y-4">
          {/* Campo Servidor (requerido) */}
          <div>
            <Label
              name="id_servidor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Servidor
            </Label>
            <Controller
              name="id_servidor"
              defaultValue={props.despliegue?.id_servidor}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={servidoresOptions}
                  value={servidoresOptions.find(
                    (opt) => opt.value === field.value
                  )}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccione un servidor..."
                  noOptionsMessage={() => 'No hay servidores disponibles'}
                  styles={selectStyles}
                  classNamePrefix="react-select"
                />
              )}
            />
            <FieldError name="id_servidor" className="rw-field-error" />
          </div>

          {/* Campo Componente (opcional) */}
          <div>
            <Label
              name="id_componente"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Componente
            </Label>
            <Controller
              name="id_componente"
              defaultValue={props.despliegue?.id_componente}
              render={({ field }) => (
                <Select
                  options={componentesOptions}
                  value={componentesOptions.find(
                    (opt) => opt.value === field.value
                  )}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccione un componente..."
                  noOptionsMessage={() => 'No hay componentes disponibles'}
                  styles={selectStyles}
                  classNamePrefix="react-select"
                  isClearable
                />
              )}
            />
            <FieldError name="id_componente" className="rw-field-error" />
          </div>

          {/* Campos restantes */}
          <div>
            <Label
              name="agrupador"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Agrupador
            </Label>
            <TextField
              name="agrupador"
              defaultValue={props.despliegue?.agrupador}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
            />
            <FieldError name="agrupador" className="rw-field-error" />
          </div>

          <div>
            <Label
              name="nombre"
              className="block text-sm font-medium text-gray-700 mb-1"
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
          </div>

          <div>
            <Label
              name="tipo"
              className="block text-sm font-medium text-gray-700 mb-1"
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
          </div>

          <div>
            <Label
              name="estado"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estado
            </Label>
            <SelectField
              name="estado"
              defaultValue={props.despliegue?.estado || 'ACTIVO'}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
            >
              {['ACTIVO', 'INACTIVO'].map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </SelectField>
            <FieldError name="estado" className="rw-field-error" />
          </div>
        </div>

        <div className="rw-button-group mt-6 flex justify-end">
          <Submit
            disabled={props.loading}
            className="rw-button rw-button-blue bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Guardar
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default DespliegueForm
