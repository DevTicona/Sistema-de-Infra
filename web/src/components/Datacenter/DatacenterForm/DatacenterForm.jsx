import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  RadioField,
  DatetimeLocalField,
  Submit,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

const DatacenterForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.datacenter?.id)
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
          defaultValue={props.datacenter?.nombre}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="nombre" className="rw-field-error" />

        <Label
          name="ubicacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Ubicacion
        </Label>

        <TextField
          name="ubicacion"
          defaultValue={props.datacenter?.ubicacion}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="ubicacion" className="rw-field-error" />

        <Label
          name="capacidad"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Capacidad
        </Label>

        <NumberField
          name="capacidad"
          defaultValue={props.datacenter?.capacidad}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="capacidad" className="rw-field-error" />

        <Label
          name="estado"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Estado
        </Label>

        <div className="rw-check-radio-items">
          <RadioField
            id="datacenter-estado-0"
            name="estado"
            defaultValue="ACTIVO"
            defaultChecked={props.datacenter?.estado?.includes('ACTIVO')}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />

          <div>Activo</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="datacenter-estado-1"
            name="estado"
            defaultValue="INACTIVO"
            defaultChecked={props.datacenter?.estado?.includes('INACTIVO')}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />

          <div>Inactivo</div>
        </div>

        <FieldError name="estado" className="rw-field-error" />

        <Label
          name="usuario_creacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario creacion
        </Label>

        <NumberField
          name="usuario_creacion"
          defaultValue={props.datacenter?.usuario_creacion}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="usuario_creacion" className="rw-field-error" />

        <Label
          name="fecha_modificacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Fecha modificacion
        </Label>

        <DatetimeLocalField
          name="fecha_modificacion"
          defaultValue={formatDatetime(props.datacenter?.fecha_modificacion)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="fecha_modificacion" className="rw-field-error" />

        <Label
          name="usuario_modificacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario modificacion
        </Label>

        <NumberField
          name="usuario_modificacion"
          defaultValue={props.datacenter?.usuario_modificacion}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="usuario_modificacion" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default DatacenterForm
