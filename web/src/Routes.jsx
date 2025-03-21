import { Set, Router, Route } from '@redwoodjs/router'

import AccesoriosLayout from 'src/layouts/AccesoriosLayout'
import ScaffoldLayout from 'src/layouts/ScaffoldLayout'
import ComponenteSelector from 'src/pages/Componente/ComponenteSelector/ComponenteSelector'
import BladesPage from 'src/pages/Datacenter/BladesPage/BladesPage'
import ChasisPage from 'src/pages/Datacenter/ChasisPage/ChasisPage'
import servidoresFisicos from 'src/pages/Datacenter/ServidoresFisicos/ServidoresFisicos'
import ServidoresPage from 'src/pages/Datacenter/ServidoresPage/ServidoresPage'
import DespliegueFiltro from 'src/pages/Despliegue/DespliegueFiltro/DespliegueFiltro'
import DespliegueSelector from 'src/pages/Despliegue/DespliegueSelector/DespliegueSelector'
import ServidorDetalle from 'src/pages/Servidor/ServidorDetalle/ServidorDetalle'
import SistemaDetalle from 'src/pages/Sistema/SistemaDetalle/SistemaDetalle'
import ReportesPage from 'src/pages/ReportesPage/ReportesPage'
import ReporteComponente from 'src/pages/ReportesPage/ReporteComponente'

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
        <Set wrap={AccesoriosLayout} title="Datacenters" titleTo="datacenters" buttonLabel="New Datacenter" buttonTo="newDatacenter">
          <Route path="/datacenters/new" page={DatacenterNewDatacenterPage} name="newDatacenter" />
          <Route path="/datacenters/{id:Int}/edit" page={DatacenterEditDatacenterPage} name="editDatacenter" />
          <Route path="/datacenters/{id:Int}" page={DatacenterDatacenterPage} name="datacenter" />
          <Route path="/datacenters" page={DatacenterDatacentersPage} name="datacenters" />
          <Route path="/datacenters/{id}/chasis" page={ChasisPage} name="chasis" />
          <Route path="/datacenters/{id}/chasis/{chasisId}/blades" page={BladesPage} name="blades" />
        </Set>
        <Set wrap={AccesoriosLayout} title="UserRols" titleTo="userRols" bsuttonLabel="New UserRol" buttonTo="newUserRol">
          <Route path="/user-rols/new" page={UserRolNewUserRolPage} name="newUserRol" />
          <Route path="/user-rols/{id:Int}/edit" page={UserRolEditUserRolPage} name="editUserRol" />
          <Route path="/user-rols/{id:Int}" page={UserRolUserRolPage} name="userRol" />
          <Route path="/user-rols" page={UserRolUserRolsPage} name="userRols" />
        </Set>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/about" page={AboutPage} name="about" />
        {/*<PrivateSet unauthenticated="home"> */}
        <Set wrap={AccesoriosLayout} title="Usuarios" titleTo="usuarios" buttonLabel="New Usuario" buttonTo="newUsuario">
          <Route path="/usuarios/new" page={UsuarioNewUsuarioPage} name="newUsuario" />
          <Route path="/usuarios/{id:Int}/edit" page={UsuarioEditUsuarioPage} name="editUsuario" />
          <Route path="/usuarios/{id:Int}" page={UsuarioUsuarioPage} name="usuario" />
          <Route path="/usuarios" page={UsuarioUsuariosPage} name="usuarios" />
        </Set>
        <Set wrap={AccesoriosLayout} title="Sistemas" titleTo="sistemas" buttonLabel="New Sistema" buttonTo="newSistema">
          <Route path="/sistemas/new" page={SistemaNewSistemaPage} name="newSistema" />
          <Route path="/sistemas/{id:Int}/edit" page={SistemaEditSistemaPage} name="editSistema" />
          <Route path="/sistemas/{id:Int}" page={SistemaSistemaPage} name="sistema" />
          <Route path="/sistemas" page={SistemaSistemasPage} name="sistemas" />
          <Route path="/sistemas/{id}/SistemaDetalle" page={SistemaDetalle} name="sistemaDetalle" />
        </Set>
        <Set wrap={AccesoriosLayout} title="Servidores" titleTo="servidors" buttonLabel="Nuevo Servidor" buttonTo="newServidor">
          <Route path="/servidors/new" page={ServidorNewServidorPage} name="newServidor" />
          <Route path="/servidors/{id:Int}/edit" page={ServidorEditServidorPage} name="editServidor" />
          <Route path="/servidors/{id:Int}" page={ServidorServidorPage} name="servidor" />
          <Route path="/servidors" page={ServidorServidorsPage} name="servidors" />
          <Route path="/servidors/{id}/servidorDetalle" page={ServidorDetalle} name="servidorDetalle" />

          <Route path="/datacenters/{id}/chasis/{chasisId}/blades/{bladeId}/servidoresPage" page={ServidoresPage} name="servidoresPage" />
          <Route path="/datacenters/{id}/servidoresFisicos" page={servidoresFisicos} name="servidoresFisicos" />
        </Set>
        <Set wrap={AccesoriosLayout} title="Rols" titleTo="rols" buttonLabel="New Rol" buttonTo="newRol">
          <Route path="/rols/new" page={RolNewRolPage} name="newRol" />
          <Route path="/rols/{id:Int}/edit" page={RolEditRolPage} name="editRol" />
          <Route path="/rols/{id:Int}" page={RolRolPage} name="rol" />
          <Route path="/rols" page={RolRolsPage} name="rols" />
        </Set>
        <Set wrap={AccesoriosLayout} title="Despliegues" titleTo="despliegues" buttonLabel="New Despliegue" buttonTo="newDespliegue">
          <Route path="/despliegues/new" page={DespliegueNewDesplieguePage} name="newDespliegue" />
          <Route path="/despliegues/{id:Int}/edit" page={DespliegueEditDesplieguePage} name="editDespliegue" />
          <Route path="/despliegues/{id:Int}" page={DespliegueDesplieguePage} name="despliegue" />
          <Route path="/despliegues" page={DespliegueDesplieguesPage} name="despliegues" />
          <Route path="/datacenters/{dataCenterId}/chasis/{chasisId}/blades/{bladeId}/servidoresPage/{servidorId:Int}/despliegueFiltro" page={DespliegueFiltro} name="despliegueFiltro" />

          <Route path="/{id}/despliegueSelector" page={DespliegueSelector} name="despliegueSelector" />
        </Set>
        <Set wrap={AccesoriosLayout} title="Entidads" titleTo="entidads" buttonLabel="New Entidad" buttonTo="newEntidad">
          <Route path="/entidads/new" page={EntidadNewEntidadPage} name="newEntidad" />
          <Route path="/entidads/{id:Int}/edit" page={EntidadEditEntidadPage} name="editEntidad" />
          <Route path="/entidads/{id:Int}" page={EntidadEntidadPage} name="entidad" />
          <Route path="/entidads" page={EntidadEntidadsPage} name="entidads" />
        </Set>
        <Set wrap={AccesoriosLayout} title="Componentes" titleTo="componentes" buttonLabel="New Componente" buttonTo="newComponente">
          <Route path="/componentes/new" page={ComponenteNewComponentePage} name="newComponente" />
          <Route path="/componentes/{id:Int}/edit" page={ComponenteEditComponentePage} name="editComponente" />
          <Route path="/componentes/{id:Int}" page={ComponenteComponentePage} name="componente" />
          <Route path="/componentes" page={ComponenteComponentesPage} name="componentes" />

          <Route path="/{id:Int}/componenteSelector" page={ComponenteSelector} name="componenteSelector" />
        </Set>
        <Set wrap={AccesoriosLayout} title="Usuariorols" titleTo="usuariorols" buttonLabel="New Usuariorol" buttonTo="newUsuariorol">
          <Route path="/usuariorols/new" page={UsuariorolNewUsuariorolPage} name="newUsuariorol" />
          <Route path="/usuariorols/{id:Int}/edit" page={UsuariorolEditUsuariorolPage} name="editUsuariorol" />
          <Route path="/usuariorols/{id:Int}" page={UsuariorolUsuariorolPage} name="usuariorol" />
          <Route path="/usuariorols" page={UsuariorolUsuariorolsPage} name="usuariorols" />
        </Set>
       <Route path="/reportes" page={ReportesPage} name="reportes" />
       <Route path="/reportecomponentes" page={ReporteComponente} name="reportecomponentes" />

       {/*</PrivateSet>*/}

      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
