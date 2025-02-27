// src/pages/BladesPage/BladesPage.js
import { Link, routes, useParams } from '@redwoodjs/router'
import './BladesPage.css' // Asegúrate de importar los estilos

const bladesData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Blade BL-0${i + 1}`,
}))

const BladesPage = () => {
  const { id, chasisId } = useParams() // Obtenemos id del data center y chasisId

  return (
    <div className="container">
      <h1 className="title">
        Data center {id} - Chasis {chasisId}
      </h1>
      <div className="grid">
        {bladesData.map((blade) => (
          <Link
            key={blade.id}
            to={routes.servidoresPage({ id, chasisId, bladeId: blade.id })} // Pasamos id, chasisId y bladeId
            className="card"
          >
            {/* Mostrar el nombre del blade como botón */}
            <button className="blade-button">{blade.name}</button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BladesPage
