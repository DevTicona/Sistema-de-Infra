import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import DatacenterForm from 'src/components/Datacenter/DatacenterForm'

export const QUERY = gql`
  query EditDatacenterById($id: Int!) {
    datacenter: datacenter(id: $id) {
      id
      nombre
      ubicacion
      capacidad
      estado
      fecha_creacion
      usuario_creacion
      fecha_modificacion
      usuario_modificacion
    }
  }
`

const UPDATE_DATACENTER_MUTATION = gql`
  mutation UpdateDatacenterMutation($id: Int!, $input: UpdateDatacenterInput!) {
    updateDatacenter(id: $id, input: $input) {
      id
      nombre
      ubicacion
      capacidad
      estado
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

export const Success = ({ datacenter }) => {
  const [updateDatacenter, { loading, error }] = useMutation(
    UPDATE_DATACENTER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Datacenter updated')
        navigate(routes.datacenters())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateDatacenter({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Datacenter {datacenter?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <DatacenterForm
          datacenter={datacenter}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
