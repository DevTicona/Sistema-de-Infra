import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  TextAreaField,
  DatetimeLocalField,
  Submit,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

const ServidorForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.servidor?.id)
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
          name="nro_cluster"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nro cluster
        </Label>

        <NumberField
          name="nro_cluster"
          defaultValue={props.servidor?.nro_cluster}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="nro_cluster" className="rw-field-error" />

        <Label
          name="vmid"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Vmid
        </Label>

        <NumberField
          name="vmid"
          defaultValue={props.servidor?.vmid}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="vmid" className="rw-field-error" />

        <Label
          name="nombre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nombre
        </Label>

        <TextField
          name="nombre"
          defaultValue={props.servidor?.nombre}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="nombre" className="rw-field-error" />

        <Label
          name="nodo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nodo
        </Label>

        <TextField
          name="nodo"
          defaultValue={props.servidor?.nodo}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="nodo" className="rw-field-error" />

        <Label
          name="ip"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Ip
        </Label>

        <TextField
          name="ip"
          defaultValue={props.servidor?.ip}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="ip" className="rw-field-error" />

        <Label
          name="tipo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tipo
        </Label>

        <TextField
          name="tipo"
          defaultValue={props.servidor?.tipo}
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

        <TextField
          name="estado"
          defaultValue={props.servidor?.estado}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="estado" className="rw-field-error" />

        <Label
          name="respaldo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Respaldo
        </Label>

        <TextAreaField
          name="respaldo"
          defaultValue={JSON.stringify(props.servidor?.respaldo)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />

        <FieldError name="respaldo" className="rw-field-error" />

        <Label
          name="usuario_creacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario creacion
        </Label>

        <NumberField
          name="usuario_creacion"
          defaultValue={props.servidor?.usuario_creacion}
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
          defaultValue={formatDatetime(props.servidor?.fecha_modificacion)}
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
          defaultValue={props.servidor?.usuario_modificacion}
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

export default ServidorForm
