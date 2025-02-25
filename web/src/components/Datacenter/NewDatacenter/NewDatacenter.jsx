import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { toast } from '@redwoodjs/web/toast'

import DatacenterForm from 'src/components/Datacenter/DatacenterForm'

const CREATE_DATACENTER_MUTATION = gql`
  mutation CreateDatacenterMutation($input: CreateDatacenterInput!) {
    createDatacenter(input: $input) {
      id
    }
  }
`

const NewDatacenter = () => {
  const [createDatacenter, { loading, error }] = useMutation(
    CREATE_DATACENTER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Datacenter created')
        navigate(routes.datacenters())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createDatacenter({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Datacenter</h2>
      </header>
      <div className="rw-segment-main">
        <DatacenterForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewDatacenter
