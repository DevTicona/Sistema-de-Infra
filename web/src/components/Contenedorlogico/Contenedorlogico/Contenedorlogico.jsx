import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import { jsonDisplay, timeTag } from 'src/lib/formatters'

const DELETE_CONTENEDORLOGICO_MUTATION = gql`
  mutation DeleteContenedorlogicoMutation($id: Int!) {
    deleteContenedorlogico(id: $id) {
      id
    }
  }
`

const Contenedorlogico = ({ contenedorlogico }) => {
  const [deleteContenedorlogico] = useMutation(
    DELETE_CONTENEDORLOGICO_MUTATION,
    {
      onCompleted: () => {
        toast.success('Contenedorlogico deleted')
        navigate(routes.contenedorlogicos())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onDeleteClick = (id) => {
    if (
      confirm('Are you sure you want to delete contenedorlogico ' + id + '?')
    ) {
      deleteContenedorlogico({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Contenedorlogico {contenedorlogico.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{contenedorlogico.id}</td>
            </tr>
            <tr>
              <th>Id padre</th>
              <td>{contenedorlogico.id_padre}</td>
            </tr>
            <tr>
              <th>Codigo</th>
              <td>{contenedorlogico.codigo}</td>
            </tr>
            <tr>
              <th>Sigla</th>
              <td>{contenedorlogico.sigla}</td>
            </tr>
            <tr>
              <th>Nombre</th>
              <td>{contenedorlogico.nombre}</td>
            </tr>
            <tr>
              <th>Descripcion</th>
              <td>{contenedorlogico.descripcion}</td>
            </tr>
            <tr>
              <th>Tipo</th>
              <td>{contenedorlogico.tipo}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{contenedorlogico.estado}</td>
            </tr>
            <tr>
              <th>Respaldo</th>
              <td>{jsonDisplay(contenedorlogico.respaldo)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(contenedorlogico.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{contenedorlogico.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(contenedorlogico.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{contenedorlogico.usuario_modificacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editContenedorlogico({ id: contenedorlogico.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(contenedorlogico.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Contenedorlogico
