import { Link, routes } from '@redwoodjs/router'
const HomeLayout = ({ children }) => {
  return (
    <>
      <header>
        <h1>
          <Link to={routes.home()}>Home Page</Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to={routes.home()}>Home</Link>
            </li>
            <li>
              <Link to={routes.about()}>About</Link>
            </li>
            <li>
              <Link to={routes.entidads()}>Entidades</Link>
            </li>
            <li>
              <Link to={routes.sistemas()}>Sistemas</Link>
            </li>
            <li>
              <Link to={routes.componentes()}>Componentes</Link>
            </li>
            <li>
              <Link to={routes.servidors()}>Servidores</Link>
            </li>
            <li>
              <Link to={routes.contenedorlogicos()}>Contenedor Logico</Link>
            </li>
            <li>
              <Link to={routes.despliegues()}>Despliegues</Link>
            </li>
            <li>
              <Link to={routes.usuarios()}>Usuarios</Link>
            </li>
            <li>
              <Link to={routes.rols()}>roles</Link>
            </li>
            <li>
              <Link to={routes.servidorcontenedors()}>
                Servidor y Contenedores
              </Link>
            </li>
            <li>
              <Link to={routes.usuariorols()}>Usurios y roles</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default HomeLayout
