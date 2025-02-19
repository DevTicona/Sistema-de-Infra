import {
  Form,
  FormError,
  FieldError,
  Label,
  SelectField,
  TextField,
  Submit,
} from '@redwoodjs/forms'
import { gql } from '@redwoodjs/graphql-client'
import { useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
const OBTENER_SISTEMAS = gql`
  query obtenerSistemas {
    sistemas {
      id
      nombre
    }
  }
`

const ComponenteForm = (props) => {
  const { currentUser } = useAuth() // Obtén el usuario logueado
  const { data: sistemasData } = useQuery(OBTENER_SISTEMAS)
  const onSubmit = (data) => {
    const formData = {
      ...data,
      usuario_modificacion: currentUser?.id, // Asigna el ID del usuario logueado
      usuario_creacion: currentUser?.id, // Asigna el ID si es creación o mantenimiento
      id_sistema: parseInt(data.id_sistema, 10),
    }
    props.onSave(formData, props?.componente?.id)
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
          name="id_sistema"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id sistema
        </Label>

        <SelectField
          name="id_sistema"
          defaultValue={props.componente?.id_sistema || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
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

        <FieldError name="id_sistema" className="rw-field-error" />

        <Label
          name="nombre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nombre
        </Label>

        <TextField
          name="nombre"
          defaultValue={props.componente?.nombre}
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
          defaultValue={props.componente?.descripcion}
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
          defaultValue={props.componente?.estado || 'ACTIVO'}
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

        <Label
          name="entorno"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Entorno
        </Label>
        <SelectField
          name="entorno"
          defaultValue={props.componente?.entorno || 'Demo'}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        >
          {['Demo', 'PreProd', 'Prod', 'Test'].map((entorno) => (
            <option key={entorno} value={entorno}>
              {entorno}
            </option>
          ))}
        </SelectField>
        <FieldError name="entorno" className="rw-field-error" />

        <Label
          name="categoria"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Categoría
        </Label>
        <SelectField
          name="categoria"
          defaultValue={props.componente?.categoria || 'Backend'}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        >
          {['Backend', 'Frontend', 'Database', 'NFS'].map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </SelectField>
        <FieldError name="categoria" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ComponenteForm
