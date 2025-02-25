import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  RadioField,
  Submit,
} from '@redwoodjs/forms'

import { useAuth } from 'src/auth'

const RolForm = (props) => {
  const { currentUser } = useAuth() // Obtén el usuario logueado
  const onSubmit = (data) => {
    // Incluir respaldo (el campo JSON de respaldo) en los datos enviados
    const formData = {
      ...data,
      usuario_modificacion: currentUser?.id, // Asigna el ID del usuario logueado
      usuario_creacion: currentUser?.id, // Asigna el ID si es creación o mantenimiento
    }
    props.onSave(formData, props?.rol?.id)
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
          name="nombre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nombre
        </Label>

        <TextField
          name="nombre"
          defaultValue={props.rol?.nombre}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="nombre" className="rw-field-error" />

        <Label
          name="tipo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tipo
        </Label>

        <TextField
          name="tipo"
          defaultValue={props.rol?.tipo}
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

        <div className="rw-check-radio-items">
          <RadioField
            id="rol-estado-0"
            name="estado"
            defaultValue="ACTIVO"
            defaultChecked={props.rol?.estado?.includes('ACTIVO')}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />

          <div>Activo</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="rol-estado-1"
            name="estado"
            defaultValue="INACTIVO"
            defaultChecked={props.rol?.estado?.includes('INACTIVO')}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />

          <div>Inactivo</div>
        </div>

        <FieldError name="estado" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default RolForm
