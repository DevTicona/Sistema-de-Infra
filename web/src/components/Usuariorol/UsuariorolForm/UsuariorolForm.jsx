import Select from 'react-select'
import {
  Form,
  FormError,
  FieldError,
  Label,
  SelectField,
  Controller,

} from '@redwoodjs/forms'
import { useQuery } from '@redwoodjs/web'
import { useAuth } from 'src/auth'

import './UsuariorolForm.css'


const OBTENER_USUARIOS = gql`
  query obtenerUsuarios {
    usuarios {
      id
      nombre_usuario
    }
  }
`

const OBTENER_ROLES = gql`
  query obtenerRols {
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
      usuario_creacion: props.usuariorol?.id ? currentUser?.id : currentUser?.id || 1,
    }
    props.onSave(formData, props?.usuariorol?.id)
  }

  return (
    <div className="usuariorol-form">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="form-error"
          listClassName="error-list"
        />

        <div className="form-grid">
          {/* Campo Usuario */}
          <div className="form-group">
            <Label className="input-label">Usuario</Label>
            <Controller
              name="id_usuario"
              defaultValue={props.usuariorol?.id_usuario}
              render={({ field }) => (
                <Select
                  options={usuariosOptions}
                  value={usuariosOptions.find(opt => opt.value === field.value)}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccionar usuario..."
                  classNamePrefix="react-select"
                />
              )}
            />
            <FieldError name="id_usuario" className="error-message" />
          </div>

          {/* Campo Rol */}
          <div className="form-group">
            <Label className="input-label">Rol</Label>
            <Controller
              name="id_rol"
              defaultValue={props.usuariorol?.id_rol}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={rolesOptions}
                  value={rolesOptions.find(opt => opt.value === field.value)}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccionar rol..."
                  classNamePrefix="react-select"
                />
              )}
            />
            <FieldError name="id_rol" className="error-message" />
          </div>

          {/* Campo Despliegue */}
          <div className="form-group">
            <Label className="input-label">Despliegue</Label>
            <Controller
              name="id_despliegue"
              defaultValue={props.usuariorol?.id_despliegue}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={desplieguesOptions}
                  value={desplieguesOptions.find(opt => opt.value === field.value)}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccionar despliegue..."
                  classNamePrefix="react-select"
                />
              )}
            />
            <FieldError name="id_despliegue" className="error-message" />
          </div>

          {/* Campo Sistema */}
          <div className="form-group">
            <Label className="input-label">Sistema</Label>
            <Controller
              name="id_sistema"
              defaultValue={props.usuariorol?.id_sistema}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  options={sistemasOptions}
                  value={sistemasOptions.find(opt => opt.value === field.value)}
                  onChange={(selected) => field.onChange(selected?.value)}
                  placeholder="Seleccionar sistema..."
                  classNamePrefix="react-select"
                />
              )}
            />
            <FieldError name="id_sistema" className="error-message" />
          </div>

          {/* Campo Estado */}
          <div className="form-group">
                        <Label className="input-label">Estado Actual</Label>
                        <SelectField
                          name="estado"
                          defaultValue={props.usuariorol?.estado || 'ACTIVO'}
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
            {props.loading ? 'Guardando..' : 'Guardar Asignación'}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default UsuariorolForm
