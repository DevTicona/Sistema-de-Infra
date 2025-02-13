// src/components/Entidad/Entidad.jsx
import React from 'react';
import './Entidad.module.css'; // Si usas CSS Modules

const Entidad = ({ entidad }) => {
  return (
    <div className="entidad-container">
      <h2 className="entidad-nombre">{entidad.nombre}</h2>
      <div className="entidad-detalles">
        <p><strong>Código:</strong> {entidad.codigo}</p>
        <p><strong>Sigla:</strong> {entidad.sigla}</p>
        <p><strong>Tipo:</strong> {entidad.tipo}</p>
        <p><strong>Estado:</strong> {entidad.estado}</p>
        <p><strong>Fecha de creación:</strong> {entidad.fecha_creacion}</p>
        <p><strong>Usuario de creación:</strong> {entidad.usuario_creacion}</p>
        <p><strong>Fecha de modificación:</strong> {entidad.fecha_modificacion}</p>
        <p><strong>Usuario de modificación:</strong> {entidad.usuario_modificacion}</p>
      </div>
    </div>
  );
};

export default Entidad;
