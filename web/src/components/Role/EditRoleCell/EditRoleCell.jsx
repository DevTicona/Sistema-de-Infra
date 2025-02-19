import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import RoleForm from 'src/components/Role/RoleForm'

export const QUERY = gql`
  query EditRoleById($id: Int!) {
    role: role(id: $id) {
      id
      name
    }
  }
`

const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateRoleMutation($id: Int!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ role }) => {
  const [updateRole, { loading, error }] = useMutation(UPDATE_ROLE_MUTATION, {
    onCompleted: () => {
      toast.success('Role updated')
      navigate(routes.roles())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input, id) => {
    updateRole({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Role {role?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <RoleForm role={role} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
