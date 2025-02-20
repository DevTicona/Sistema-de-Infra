import {
  Form,
  FormError,
  FieldError,
  Label,
  SelectField,
  Submit,
} from '@redwoodjs/forms'
import { useQuery } from '@redwoodjs/web'

const USERS_QUERY = gql`
  query obtenerUsers {
    users {
      id
      email
    }
  }
`

const ROLES_QUERY = gql`
  query obtenerRoles {
    roles {
      id
      name
    }
  }
`

const UserRolForm = (props) => {
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(USERS_QUERY)
  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
  } = useQuery(ROLES_QUERY)

  const onSubmit = (data) => {
    props.onSave(
      {
        userId: parseInt(data.userId, 10),
        roleId: parseInt(data.roleId, 10),
      },
      props?.userRol?.id
    )
  }

  if (usersLoading || rolesLoading) return <div>Loading...</div>
  if (usersError || rolesError)
    return <div>Error: {usersError?.message || rolesError?.message}</div>

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
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Usuario (Email)
        </Label>
        <SelectField
          name="userId"
          defaultValue={props.userRol?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Seleccione un usuario</option>
          {usersData?.users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </SelectField>
        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="roleId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Rol
        </Label>
        <SelectField
          name="roleId"
          defaultValue={props.userRol?.roleId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        >
          <option value="">Seleccione un rol</option>
          {rolesData?.roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </SelectField>
        <FieldError name="roleId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Guardar
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default UserRolForm
