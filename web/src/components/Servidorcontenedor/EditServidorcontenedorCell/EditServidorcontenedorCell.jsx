import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ServidorcontenedorForm from 'src/components/Servidorcontenedor/ServidorcontenedorForm'

export const QUERY = gql`
  query EditServidorcontenedorById($id: Int!) {
    servidorcontenedor: servidorcontenedor(id: $id) {
      id
      id_servidor
      id_contenedor_logico
      sigla
      nombre
      descripcion
      tipo
      estado
      respaldo
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

const UPDATE_SERVIDORCONTENEDOR_MUTATION = gql`
  mutation UpdateServidorcontenedorMutation(
    $id: Int!
    $input: UpdateServidorcontenedorInput!
  ) {
    updateServidorcontenedor(id: $id, input: $input) {
      id
      id_servidor
      id_contenedor_logico
      sigla
      nombre
      descripcion
      tipo
      estado
      respaldo
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ servidorcontenedor }) => {
  const [updateServidorcontenedor, { loading, error }] = useMutation(
    UPDATE_SERVIDORCONTENEDOR_MUTATION,
    {
      onCompleted: () => {
        toast.success('Servidorcontenedor updated')
        navigate(routes.servidorcontenedors())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateServidorcontenedor({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Servidorcontenedor {servidorcontenedor?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ServidorcontenedorForm
          servidorcontenedor={servidorcontenedor}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
