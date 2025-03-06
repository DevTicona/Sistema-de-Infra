import Select from 'react-select'

import {
  Form,
  FormError,
  FieldError,
  Label,
  Submit,
  Controller,
  SelectField,
} from '@redwoodjs/forms'
import { useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const OBTENER_USUARIOS = gql`
  query obtenerUsuarios {
    usuarios {
      id
      nombre_usuario
    }
  }
`

const OBTENER_ROLES = gql`
  query obtenerRoles {
    rols {
      id
      nombre
    }
  }
`

const OBTENER_DESPLIEGUES = gql`
  query obtenerDespliegues {
    despliegues {
      id
      nombre
    }
  }
`

const OBTENER_SISTEMAS = gql`
  query obtenerSistemas {
    sistemas {
      id
      nombre
    }
  }
`

const UsuariorolForm = (props) => {
  const { currentUser } = useAuth()

  // Consultas para obtener los datos
  const { data: usuariosData } = useQuery(OBTENER_USUARIOS)
  const { data: rolesData } = useQuery(OBTENER_ROLES)
  const { data: desplieguesData } = useQuery(OBTENER_DESPLIEGUES)
  const { data: sistemasData } = useQuery(OBTENER_SISTEMAS)

  // Preparar opciones para los selects
  const usuariosOptions =
    usuariosData?.usuarios?.map((u) => ({
      value: u.id,
      label: u.nombre_usuario,
    })) || []

  const rolesOptions =
    rolesData?.rols?.map((r) => ({
      value: r.id,
      label: r.nombre,
    })) || []

  const desplieguesOptions =
    desplieguesData?.despliegues?.map((d) => ({
      value: d.id,
      label: d.nombre,
    })) || []

  const sistemasOptions =
    sistemasData?.sistemas?.map((s) => ({
      value: s.id,
      label: s.nombre,
    })) || []

  const onSubmit = (data) => {
    const formData = {
      ...data,
      usuario_modificacion: currentUser?.id,
      usuario_creacion: props.usuariorol?.id
        ? currentUser?.id
        : currentUser?.id || 1,
    }
    props.onSave(formData, props?.usuariorol?.id)
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
          {/* Campo Usuario */}
          <div>
            <Label
              name="id_usuario"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usuario
            </Label>
            <Controller
              name="id_usuario"
              defaultValue={props.usuariorol?.id_usuario}
              render={({ field }) => (
                <Select
                  options={usuariosOptions}
                  value={usuariosOptions.find(
                    (opt) => opt.value === field.value
                  )}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccione un usuario..."
                  noOptionsMessage={() => 'No hay usuarios disponibles'}
                  styles={selectStyles}
                  classNamePrefix="react-select"
                />
              )}
            />
            <FieldError name="id_usuario" className="rw-field-error" />
          </div>

          {/* Campo Rol */}
          <div>
            <Label
              name="id_rol"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rol
            </Label>
            <Controller
              name="id_rol"
              defaultValue={props.usuariorol?.id_rol}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={rolesOptions}
                  value={rolesOptions.find((opt) => opt.value === field.value)}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccione un rol..."
                  noOptionsMessage={() => 'No hay roles disponibles'}
                  styles={selectStyles}
                  classNamePrefix="react-select"
                />
              )}
            />
            <FieldError name="id_rol" className="rw-field-error" />
          </div>

          {/* Campo Despliegue */}
          <div>
            <Label
              name="id_despliegue"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Despliegue
            </Label>
            <Controller
              name="id_despliegue"
              defaultValue={props.usuariorol?.id_despliegue}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={desplieguesOptions}
                  value={desplieguesOptions.find(
                    (opt) => opt.value === field.value
                  )}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccione un despliegue..."
                  noOptionsMessage={() => 'No hay despliegues disponibles'}
                  styles={selectStyles}
                  classNamePrefix="react-select"
                />
              )}
            />
            <FieldError name="id_despliegue" className="rw-field-error" />
          </div>

          {/* Campo Sistema */}
          <div>
            <Label
              name="id_sistema"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sistema
            </Label>
            <Controller
              name="id_sistema"
              defaultValue={props.usuariorol?.id_sistema}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={sistemasOptions}
                  value={sistemasOptions.find(
                    (opt) => opt.value === field.value
                  )}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccione un sistema..."
                  noOptionsMessage={() => 'No hay sistemas disponibles'}
                  styles={selectStyles}
                  classNamePrefix="react-select"
                />
              )}
            />
            <FieldError name="id_sistema" className="rw-field-error" />
          </div>
        </div>
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

export default UsuariorolForm
