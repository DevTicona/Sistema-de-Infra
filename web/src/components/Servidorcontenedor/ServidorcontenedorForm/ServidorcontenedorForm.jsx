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

const ServidorcontenedorForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.servidorcontenedor?.id)
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
          name="id_servidor"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id servidor
        </Label>

        <NumberField
          name="id_servidor"
          defaultValue={props.servidorcontenedor?.id_servidor}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="id_servidor" className="rw-field-error" />

        <Label
          name="id_contenedor_logico"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id contenedor logico
        </Label>

        <NumberField
          name="id_contenedor_logico"
          defaultValue={props.servidorcontenedor?.id_contenedor_logico}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="id_contenedor_logico" className="rw-field-error" />

        <Label
          name="sigla"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Sigla
        </Label>

        <TextField
          name="sigla"
          defaultValue={props.servidorcontenedor?.sigla}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="sigla" className="rw-field-error" />

        <Label
          name="nombre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nombre
        </Label>

        <TextField
          name="nombre"
          defaultValue={props.servidorcontenedor?.nombre}
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
          defaultValue={props.servidorcontenedor?.descripcion}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="descripcion" className="rw-field-error" />

        <Label
          name="tipo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tipo
        </Label>

        <TextField
          name="tipo"
          defaultValue={props.servidorcontenedor?.tipo}
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
          defaultValue={props.servidorcontenedor?.estado}
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
          defaultValue={JSON.stringify(props.servidorcontenedor?.respaldo)}
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
          defaultValue={props.servidorcontenedor?.usuario_creacion}
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
          defaultValue={formatDatetime(
            props.servidorcontenedor?.fecha_modificacion
          )}
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
          defaultValue={props.servidorcontenedor?.usuario_modificacion}
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

export default ServidorcontenedorForm
