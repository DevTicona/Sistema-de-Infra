import { useState, useEffect } from 'react'

import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  Submit,
  SelectField,
} from '@redwoodjs/forms'

import PLANTILLAS_RESPALDO from 'src/utils/plantillasRespaldo.js'

// Componente para validación y autocompletado de IP
const IPAutoComplete = ({ defaultValue, className, errorClassName }) => {
  const [inputValue, setInputValue] = useState(defaultValue || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isValid, setIsValid] = useState(true)

  // Redes comunes en infraestructura AGETIC
  const commonPrefixes = [
    '10.0.10.',
    '10.0.20.',
    '10.1.0.',
    '172.16.10.',
    '172.16.20.',
    '192.168.1.',
    '192.168.10.',
  ]

  // Últimos octetos comunes
  const commonLastOctets = ['1', '2', '5', '10', '20', '50', '100', '200', '254']

  // Validar formato de IP
  const validateIP = (ip) => {
    if (!ip) return true // Vacío es válido para el UI (aunque requerido en validación)
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return ipRegex.test(ip)
  }

  // Actualizar sugerencias basadas en el input
  useEffect(() => {
    if (inputValue) {
      const parts = inputValue.split('.')
      let filtered = []

      // Si estamos escribiendo un prefijo (menos de 4 partes)
      if (parts.length < 4) {
        filtered = commonPrefixes
          .filter(prefix => prefix.startsWith(inputValue))
          .slice(0, 6)
      }
      // Si ya tenemos 3 partes completas, sugerir el último octeto
      else if (parts.length === 4 && parts[3] === '') {
        const prefix = parts.slice(0, 3).join('.')
        filtered = commonLastOctets.map(octeto => `${prefix}.${octeto}`)
      }
      // Si estamos escribiendo el último octeto
      else if (parts.length === 4 && parts[3]) {
        const prefix = parts.slice(0, 3).join('.')
        filtered = commonLastOctets
          .filter(octeto => octeto.startsWith(parts[3]))
          .map(octeto => `${prefix}.${octeto}`)
      }

      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)

      // Validar formato
      setIsValid(validateIP(inputValue))
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setIsValid(true)
    }
  }, [inputValue])

  const handleChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e) => {
    // Autocompletar con Tab
    if (e.key === 'Tab' && showSuggestions && suggestions.length > 0) {
      e.preventDefault()
      setInputValue(suggestions[0])
      setShowSuggestions(false)
    }

    // Auto-añadir punto después de ingresar un número
    if (e.key >= '0' && e.key <= '9') {
      const parts = inputValue.split('.')
      if (parts.length < 4) {
        const lastPart = parts[parts.length - 1]
        if (lastPart && lastPart.length === 2 && !isNaN(lastPart)) {
          setTimeout(() => {
            setInputValue(prev => prev + '.')
          }, 10)
        }
      }
    }
  }

  const selectSuggestion = (suggestion) => {
    setInputValue(suggestion)
    setShowSuggestions(false)
    setIsValid(validateIP(suggestion))
  }

  return (
    <div className="relative">
      <div className="flex items-center">
        <TextField
          name="ip"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`${className} ${!isValid ? errorClassName : ''}`}
          placeholder="Ej: 10.0.10.1 (Tab para autocompletar)"
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => inputValue && setSuggestions.length > 0 && setShowSuggestions(true)}
          validation={{
            required: true,
            validate: {
              validIp: (value) => validateIP(value) || 'Formato de IP inválido'
            }
          }}
        />
        {!isValid && (
          <div className="ml-2 text-xs text-red-500">
            ⚠️ Formato inválido
          </div>
        )}
      </div>

      {/* Sugerencias rápidas */}
      {showSuggestions && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-md rounded border border-gray-200">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-1 hover:bg-blue-50 cursor-pointer text-sm"
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const MetadataField = ({ defaultValue, tipo }) => {
  const [metadataData, setMetadataData] = useState(
    defaultValue || PLANTILLAS_RESPALDO[tipo] || {}
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setMetadataData((prevData) => {
      const updatedData = { ...prevData, [name]: value }
      console.log('Actualizando metadataData:', updatedData)
      return updatedData
    })
  }

  return (
    <div>
      {Object.keys(metadataData).map((key) => (
        <div key={key}>
          <Label className="rw-label">{key}</Label>
          <TextField
            name={key}
            value={metadataData[key] || ''}
            onChange={handleChange}
            className="rw-input"
          />
        </div>
      ))}
      <input
        type="hidden"
        name="metadata"
        value={JSON.stringify(metadataData)}
      />
    </div>
  )
}

const ServidorForm = (props) => {
  const onSubmit = (data) => {
    const metadataInput = document.querySelector('input[name="metadata"]')

    // Asegurarse que la IP tiene un formato válido
    const ipValue = data.ip?.trim();
    if (ipValue) {
      // Validar formato IP correcto antes de enviar
      const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      if (!ipRegex.test(ipValue)) {
        console.error('Error: IP inválida', ipValue);
        alert('Formato de IP inválido. Debe tener formato: xxx.xxx.xxx.xxx con valores entre 0-255');
        return;
      }
    }

    const formData = {
      ...data,
      metadata: metadataInput ? JSON.parse(metadataInput.value) : {}, // Asegurar que sea un objeto
    }

    console.log('Formulario enviado con metadata:', formData)
    props.onSave(formData, props?.servidor?.id)
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
          IP
        </Label>
        <IPAutoComplete
          defaultValue={props.servidor?.ip}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />
        <FieldError name="ip" className="rw-field-error" />

        <Label
          name="tipo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tipo
        </Label>
        <SelectField
          name="tipo"
          defaultValue={props.servidor?.tipo}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Selecciona una opción</option>
          <option value="Fisico">Físico</option>
          <option value="Virtual">Virtual</option>
        </SelectField>
        <FieldError name="tipo" className="rw-field-error" />

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
          validation={{ required: true }}
        >
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </SelectField>
        <MetadataField
          defaultValue={props.servidor?.metadata}
          tipo="servidor"
        />

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
