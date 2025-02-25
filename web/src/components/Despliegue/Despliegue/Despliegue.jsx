import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { jsonDisplay, timeTag } from 'src/lib/formatters'

const DELETE_DESPLIEGUE_MUTATION = gql`
  mutation DeleteDespliegueMutation($id: Int!) {
    deleteDespliegue(id: $id) {
      id
    }
  }
`

const Despliegue = ({ despliegue }) => {
  const [deleteDespliegue] = useMutation(DELETE_DESPLIEGUE_MUTATION, {
    onCompleted: () => {
      toast.success('Despliegue deleted')
      navigate(routes.despliegues())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete despliegue ' + id + '?')) {
      deleteDespliegue({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Despliegue {despliegue.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{despliegue.id}</td>
            </tr>
            <tr>
              <th>Id componente</th>
              <td>{despliegue.id_componente}</td>
            </tr>
            <tr>
              <th>Id contenedor logico</th>
              <td>{despliegue.id_contenedor_logico}</td>
            </tr>
            <tr>
              <th>Sigla</th>
              <td>{despliegue.sigla}</td>
            </tr>
            <tr>
              <th>Nombre</th>
              <td>{despliegue.nombre}</td>
            </tr>
            <tr>
              <th>Descripcion</th>
              <td>{despliegue.descripcion}</td>
            </tr>
            <tr>
              <th>Tipo</th>
              <td>{despliegue.tipo}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{despliegue.estado}</td>
            </tr>
            <tr>
              <th>Respaldo</th>
              <td>{jsonDisplay(despliegue.respaldo)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(despliegue.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{despliegue.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(despliegue.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{despliegue.usuario_modificacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editDespliegue({ id: despliegue.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(despliegue.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Despliegue
