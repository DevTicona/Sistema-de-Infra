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

import './ComponenteForm.css'

const OBTENER_SISTEMAS = gql`
  query obtenerSistemas {
    sistemas {
      id
      nombre
    }
  }
`

const ComponenteForm = (props) => {
  const { currentUser } = useAuth()
  const { data: sistemasData } = useQuery(OBTENER_SISTEMAS)

  const onSubmit = (data) => {
    const formData = {
      ...data,
      usuario_modificacion: currentUser?.id,
      usuario_creacion: props.componente?.usuario_creacion || currentUser?.id || 1,
      id_sistema: parseInt(data.id_sistema, 10),
    }
    props.onSave(formData, props?.componente?.id)
  }

  return (
    <div className="componente-form">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError error={props.error} className="form-error" />

        <div className="form-grid">
          {/* Sistema */}
          <div className="form-group">
            <Label className="input-label">Sistema*</Label>
            <SelectField
              name="id_sistema"
              defaultValue={props.componente?.id_sistema || ''}
              className="input-field"
              validation={{ required: true }}
            >
              <option value="">Seleccionar sistema...</option>
              {sistemasData?.sistemas?.map((sistema) => (
                <option key={sistema.id} value={sistema.id}>
                  {sistema.nombre}
                </option>
              ))}
            </SelectField>
            <FieldError name="id_sistema" className="error-message" />
          </div>

          {/* Nombre */}
          <div className="form-group">
            <Label className="input-label">Nombre</Label>
            <TextField
              name="nombre"
              defaultValue={props.componente?.nombre}
              className="input-field"
              validation={{ required: true }}
            />
            <FieldError name="nombre" className="error-message" />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <Label className="input-label">Descripción</Label>
            <TextField
              name="descripcion"
              defaultValue={props.componente?.descripcion}
              className="input-field"
              validation={{ required: true }}
              as="textarea"
              rows={3}
            />
            <FieldError name="descripcion" className="error-message" />
          </div>

          {/* Estado */}
          <div className="form-group">
            <Label className="input-label">Estado</Label>
            <SelectField
              name="estado"
              defaultValue={props.componente?.estado || 'ACTIVO'}
              className="input-field"
              validation={{ required: true }}
            >
              {['ACTIVO', 'INACTIVO'].map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </SelectField>
            <FieldError name="estado" className="error-message" />
          </div>

          {/* Entorno */}
          <div className="form-group">
            <Label className="input-label">Entorno</Label>
            <SelectField
              name="entorno"
              defaultValue={props.componente?.entorno || 'Demo'}
              className="input-field"
              validation={{ required: true }}
            >
              {['Demo', 'PreProd', 'Prod', 'Test'].map((entorno) => (
                <option key={entorno} value={entorno}>
                  {entorno}
                </option>
              ))}
            </SelectField>
            <FieldError name="entorno" className="error-message" />
          </div>

          {/* Categoría */}
          <div className="form-group">
            <Label className="input-label">Categoría</Label>
            <SelectField
              name="categoria"
              defaultValue={props.componente?.categoria || 'Backend'}
              className="input-field"
              validation={{ required: true }}
            >
              {['Backend', 'Frontend', 'Database', 'NFS'].map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </SelectField>
            <FieldError name="categoria" className="error-message" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={props.loading}>
            {props.loading ? 'Guardando...' : 'Guardar Componente'}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default ComponenteForm
