import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_COMPONENTE_MUTATION = gql`
  mutation DeleteComponenteMutation($id: Int!) {
    deleteComponente(id: $id) {
      id
    }
  }
`

const Componente = ({ componente }) => {
  const [deleteComponente] = useMutation(DELETE_COMPONENTE_MUTATION, {
    onCompleted: () => {
      toast.success('Componente deleted')
      navigate(routes.componentes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete componente ' + id + '?')) {
      deleteComponente({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Componente {componente.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{componente.id}</td>
            </tr>
            <tr>
              <th>Sistema Asociado</th>
              <td>{componente.sistemas.nombre}</td>
            </tr>
            <tr>
              <th>Nombre</th>
              <td>{componente.nombre}</td>
            </tr>
            <tr>
              <th>Descripcion</th>
              <td>{componente.descripcion}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{componente.estado}</td>
            </tr>
            <tr>
              <th>Entorno</th>
              <td>{componente.entorno}</td>
            </tr>
            <tr>
              <th>Categoria</th>
              <td>{componente.categoria}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{timeTag(componente.fecha_creacion)}</td>
            </tr>
            <tr>
              <th>Usuario creacion</th>
              <td>{componente.usuario_creacion}</td>
            </tr>
            <tr>
              <th>Fecha modificacion</th>
              <td>{timeTag(componente.fecha_modificacion)}</td>
            </tr>
            <tr>
              <th>Usuario modificacion</th>
              <td>{componente.usuario_modificacion}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editComponente({ id: componente.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(componente.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Componente
