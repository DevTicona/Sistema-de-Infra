import { Set, Router, Route, PrivateSet } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import { useAuth } from './auth'
import HomeLayout from './layouts/HomeLayout/HomeLayout'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Set wrap={HomeLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/about" page={AboutPage} name="about" />
        <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
          <Route path="/users/new" page={UserNewUserPage} name="newUser" />
          <Route path="/users/{id:Int}/edit" page={UserEditUserPage} name="editUser" />
          <Route path="/users/{id:Int}" page={UserUserPage} name="user" />
          <Route path="/users" page={UserUsersPage} name="users" />
        </Set>
        <PrivateSet unauthenticated="home">
          <Set wrap={ScaffoldLayout} title="Usuarios" titleTo="usuarios" buttonLabel="New Usuario" buttonTo="newUsuario">
            <Route path="/usuarios/new" page={UsuarioNewUsuarioPage} name="newUsuario" />
            <Route path="/usuarios/{id:Int}/edit" page={UsuarioEditUsuarioPage} name="editUsuario" />
            <Route path="/usuarios/{id:Int}" page={UsuarioUsuarioPage} name="usuario" />
            <Route path="/usuarios" page={UsuarioUsuariosPage} name="usuarios" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Sistemas" titleTo="sistemas" buttonLabel="New Sistema" buttonTo="newSistema">
            <Route path="/sistemas/new" page={SistemaNewSistemaPage} name="newSistema" />
            <Route path="/sistemas/{id:Int}/edit" page={SistemaEditSistemaPage} name="editSistema" />
            <Route path="/sistemas/{id:Int}" page={SistemaSistemaPage} name="sistema" />
            <Route path="/sistemas" page={SistemaSistemasPage} name="sistemas" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Servidors" titleTo="servidors" buttonLabel="New Servidor" buttonTo="newServidor">
            <Route path="/servidors/new" page={ServidorNewServidorPage} name="newServidor" />
            <Route path="/servidors/{id:Int}/edit" page={ServidorEditServidorPage} name="editServidor" />
            <Route path="/servidors/{id:Int}" page={ServidorServidorPage} name="servidor" />
            <Route path="/servidors" page={ServidorServidorsPage} name="servidors" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Rols" titleTo="rols" buttonLabel="New Rol" buttonTo="newRol">
            <Route path="/rols/new" page={RolNewRolPage} name="newRol" />
            <Route path="/rols/{id:Int}/edit" page={RolEditRolPage} name="editRol" />
            <Route path="/rols/{id:Int}" page={RolRolPage} name="rol" />
            <Route path="/rols" page={RolRolsPage} name="rols" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Despliegues" titleTo="despliegues" buttonLabel="New Despliegue" buttonTo="newDespliegue">
            <Route path="/despliegues/new" page={DespliegueNewDesplieguePage} name="newDespliegue" />
            <Route path="/despliegues/{id:Int}/edit" page={DespliegueEditDesplieguePage} name="editDespliegue" />
            <Route path="/despliegues/{id:Int}" page={DespliegueDesplieguePage} name="despliegue" />
            <Route path="/despliegues" page={DespliegueDesplieguesPage} name="despliegues" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Contenedorlogicos" titleTo="contenedorlogicos" buttonLabel="New Contenedorlogico" buttonTo="newContenedorlogico">
            <Route path="/contenedorlogicos/new" page={ContenedorlogicoNewContenedorlogicoPage} name="newContenedorlogico" />
            <Route path="/contenedorlogicos/{id:Int}/edit" page={ContenedorlogicoEditContenedorlogicoPage} name="editContenedorlogico" />
            <Route path="/contenedorlogicos/{id:Int}" page={ContenedorlogicoContenedorlogicoPage} name="contenedorlogico" />
            <Route path="/contenedorlogicos" page={ContenedorlogicoContenedorlogicosPage} name="contenedorlogicos" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Entidads" titleTo="entidads" buttonLabel="New Entidad" buttonTo="newEntidad">
            <Route path="/entidads/new" page={EntidadNewEntidadPage} name="newEntidad" />
            <Route path="/entidads/{id:Int}/edit" page={EntidadEditEntidadPage} name="editEntidad" />
            <Route path="/entidads/{id:Int}" page={EntidadEntidadPage} name="entidad" />
            <Route path="/entidads" page={EntidadEntidadsPage} name="entidads" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Componentes" titleTo="componentes" buttonLabel="New Componente" buttonTo="newComponente">
            <Route path="/componentes/new" page={ComponenteNewComponentePage} name="newComponente" />
            <Route path="/componentes/{id:Int}/edit" page={ComponenteEditComponentePage} name="editComponente" />
            <Route path="/componentes/{id:Int}" page={ComponenteComponentePage} name="componente" />
            <Route path="/componentes" page={ComponenteComponentesPage} name="componentes" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Servidorcontenedors" titleTo="servidorcontenedors" buttonLabel="New Servidorcontenedor" buttonTo="newServidorcontenedor">
            <Route path="/servidorcontenedors/new" page={ServidorcontenedorNewServidorcontenedorPage} name="newServidorcontenedor" />
            <Route path="/servidorcontenedors/{id:Int}/edit" page={ServidorcontenedorEditServidorcontenedorPage} name="editServidorcontenedor" />
            <Route path="/servidorcontenedors/{id:Int}" page={ServidorcontenedorServidorcontenedorPage} name="servidorcontenedor" />
            <Route path="/servidorcontenedors" page={ServidorcontenedorServidorcontenedorsPage} name="servidorcontenedors" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Usuariorols" titleTo="usuariorols" buttonLabel="New Usuariorol" buttonTo="newUsuariorol">
            <Route path="/usuariorols/new" page={UsuariorolNewUsuariorolPage} name="newUsuariorol" />
            <Route path="/usuariorols/{id:Int}/edit" page={UsuariorolEditUsuariorolPage} name="editUsuariorol" />
            <Route path="/usuariorols/{id:Int}" page={UsuariorolUsuariorolPage} name="usuariorol" />
            <Route path="/usuariorols" page={UsuariorolUsuariorolsPage} name="usuariorols" />
          </Set>
        </PrivateSet>
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
