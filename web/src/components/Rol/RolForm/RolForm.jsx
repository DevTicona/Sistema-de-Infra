
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,

  Submit,
  SelectField,
} from '@redwoodjs/forms'

const RolForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.rol?.id)
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

        {/* Campo Nombre */}
        <Label
          name="nombre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nombre
        </Label>
        <TextField
          name="nombre"
          defaultValue={props.rol?.nombre || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="nombre" className="rw-field-error" />

        {/* Campo Tipo */}
        <Label
          name="tipo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tipo
        </Label>
        <TextField
          name="tipo"
          defaultValue={props.rol?.tipo || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="tipo" className="rw-field-error" />

        {/* Campo Estado */}
        <Label
          name="estado"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Estado
        </Label>
         <SelectField
          name="estado"
          defaultValue={props.componente?.estado || 'ACTIVO'}  // Valor por defecto
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </SelectField>
        <FieldError name="estado" className="rw-field-error" />

        {/* Campo Usuario Creacion */}
        <Label
          name="usuario_creacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario Creacion
        </Label>
        <NumberField
          name="usuario_creacion"
          defaultValue={props.rol?.usuario_creacion || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <FieldError name="usuario_creacion" className="rw-field-error" />

        {/* Campo Usuario Modificacion */}
        <Label
          name="usuario_modificacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario Modificacion
        </Label>
        <NumberField
          name="usuario_modificacion"
          defaultValue={props.rol?.usuario_modificacion || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />
        <FieldError name="usuario_modificacion" className="rw-field-error" />

        {/* Botón de Envío */}
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
