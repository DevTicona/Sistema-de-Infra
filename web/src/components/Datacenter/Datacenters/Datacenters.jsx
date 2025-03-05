import { Link, routes } from '@redwoodjs/router'

import { formatEnum, truncate } from 'src/lib/formatters'

const DatacentersList = ({ datacenters }) => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {datacenters.map((datacenter) => (
        <Link
          key={datacenter.id}
          to={routes.chasis({ id: datacenter.id })}
          className="datacenter-card"
          style={{
            display: 'block',
            width: '90%', // Ajusta el ancho para que se vea mejor centrado
            maxWidth: '400px', // Máximo ancho para evitar que se expanda demasiado
            marginBottom: '2rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            textDecoration: 'none',
            color: 'inherit',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            {truncate(datacenter.nombre)}
          </h2>
          <div className="datacenter-details" style={{ fontSize: '1rem' }}>
            <p>
              <strong>Ubicación:</strong> {truncate(datacenter.ubicacion)}
            </p>
            <p>
              <strong>Estado:</strong> {formatEnum(datacenter.estado)}
            </p>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link
              to={routes.editDatacenter({ id: datacenter.id })}
              title={`Editar datacenter ${datacenter.id}`}
              className="rw-button rw-button-blue"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '80px', // Ancho fijo más corto
                padding: '0.3rem 0.5rem', // Reduce el espacio interno
                borderRadius: '5px',
                fontSize: '0.9rem',
                display: 'inline-block', // Asegura que el tamaño se respete
                textAlign: 'center',
              }}
            >
              Editar
            </Link>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default DatacentersList
