import { useState } from 'react'

import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  SelectField,
  Submit,
} from '@redwoodjs/forms'
import { gql } from '@redwoodjs/graphql-client'
import { useQuery } from '@redwoodjs/web'

// Consulta GraphQL para obtener los sistemas
const OBTENER_USUARIOS = gql`
  query ObtenerUsuarios {
    usuarios {
      id
      nombre_usuario
    }
  }
`
// Consulta GraphQL para obtener los sistemas
const OBTENER_ROLES = gql`
  query ObtenerRoles {
    rols {
      id
      nombre
    }
  }
`
// Consulta GraphQL para obtener los sistemas
const OBTENER_SISTEMAS = gql`
  query ObtenerSistemas {
    sistemas {
      id
      nombre
    }
  }
`
// Consulta GraphQL para obtener los sistemas
const OBTENER_CONTENEDORES = gql`
  query ObtenerContenedores {
    contenedorlogicos {
      id
      nombre
    }
  }
`

const RespaldoField = ({ defaultValue }) => {
  const [respaldoData, setRespaldoData] = useState(
    defaultValue || { version: '' }
  )

  const handleChange = (event) => {
    setRespaldoData({
      ...respaldoData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <Label className="rw-label">Versión</Label>
      <TextField
        name="version"
        value={respaldoData.version || ''}
        onChange={handleChange}
        className="rw-input"
      />
      <input
        type="hidden"
        name="respaldo"
        value={JSON.stringify(respaldoData)} // Convertir los datos del respaldo a JSON
      />
    </div>
  )
}
const UsuariorolForm = (props) => {
  const { data: usuariosData } = useQuery(OBTENER_USUARIOS)
  const { data: rolesData } = useQuery(OBTENER_ROLES)
  const { data: sistemasData } = useQuery(OBTENER_SISTEMAS)
  const { data: contenedoresData } = useQuery(OBTENER_CONTENEDORES)
  const onSubmit = (data) => {
    const formData = {
      ...data,
      id_usuario: parseInt(data.id_usuario, 10),
      id_rol: parseInt(data.id_rol, 10),
      id_sistema: parseInt(data.id_sistema, 10),
      id_contenedor_logico: parseInt(data.id_contenedor_logico, 10),
      respaldo: data.respaldo ? JSON.parse(data.respaldo) : {},
    }
    props.onSave(formData, props?.usuariorol?.id)
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
          name="id_usuario"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario
        </Label>

        <SelectField
          name="id_usuario"
          defaultValue={props.usuariorol?.id_usuario || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Seleccione un Usuario</option>
          {usuariosData?.usuarios?.length > 0 ? (
            usuariosData.usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre_usuario}
              </option>
            ))
          ) : (
            <option disabled>No hay usuarios disponibles</option>
          )}
        </SelectField>

        <FieldError name="id_usuario" className="rw-field-error" />

        <Label
          name="id_rol"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id rol
        </Label>

        <SelectField
          name="id_rol"
          defaultValue={props.usuariorol?.id_rol || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Seleccione un rol</option>
          {rolesData?.rols?.length > 0 ? (
            rolesData.rols.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))
          ) : (
            <option disabled>No hay roles disponibles</option>
          )}
        </SelectField>

        <FieldError name="id_rol" className="rw-field-error" />

        <Label
          name="id_contenedor_logico"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id contenedor logico
        </Label>

        <SelectField
          name="id_contenedor_logico"
          defaultValue={props.usuariorol?.id_contenedor_logico || ''}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Seleccione un contenedor logico</option>
          {contenedoresData?.contenedorlogicos?.length > 0 ? (
            contenedoresData.contenedorlogicos.map((contenedorlogico) => (
              <option key={contenedorlogico.id} value={contenedorlogico.id}>
                {contenedorlogico.nombre}
              </option>
            ))
          ) : (
            <option disabled>No hay contenedores logicos disponibles</option>
          )}
        </SelectField>

        <FieldError name="id_contenedor_logico" className="rw-field-error" />

        <Label
          name="id_sistema"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id sistema
        </Label>

        <SelectField
          name="id_sistema"
          defaultValue={props.usuariorol?.id_sistema || ''}
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
          name="descripcion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Descripcion
        </Label>

        <TextField
          name="descripcion"
          defaultValue={props.usuariorol?.descripcion}
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
          defaultValue={props.usuariorol?.tipo}
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
          defaultValue={props.usuariorol?.estado}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="estado" className="rw-field-error" />

        {/* respaldo JSON Input */}
        <RespaldoField defaultValue={props.usuariorol?.respaldo} />

        <Label
          name="usuario_creacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario creacion
        </Label>

        <NumberField
          name="usuario_creacion"
          defaultValue={props.usuariorol?.usuario_creacion}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="usuario_creacion" className="rw-field-error" />

        <Label
          name="usuario_modificacion"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario modificacion
        </Label>

        <NumberField
          name="usuario_modificacion"
          defaultValue={props.usuariorol?.usuario_modificacion}
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

export default UsuariorolForm
