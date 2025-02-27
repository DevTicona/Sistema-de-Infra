import { Link, routes, useParams } from '@redwoodjs/router'
import './ChasisPage.css' // Asegúrate de importar los estilos

const chasisData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Chasis CH-0${i + 1}`,
}))

const ChasisPage = () => {
  const { id } = useParams() // Obtenemos el id del data center desde la URL

  return (
    <div className="container">
      <h1 className="title">Data center {id}</h1>
      <div className="content">
        {/* Contenedor izquierdo para servidores virtuales */}
        <div className="left-container">
          <h2>Servidores Virtuales</h2>
          <div className="grid">
            {chasisData.map((chasis) => (
              <Link
                key={chasis.id}
                to={routes.blades({ id, chasisId: chasis.id })} // Pasamos id y chasisId
                className="rw-button"
              >
                <button className="chasis-button">{chasis.name}</button>
              </Link>
            ))}
          </div>
        </div>

        {/* Contenedor derecho con botones de navegación */}
        <div className="right-container">
          <Link to={routes.servidoresFisicos({ id })} className="rw-button">
            <button className="navigate-button">Ver Servidores Físicos</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ChasisPage
