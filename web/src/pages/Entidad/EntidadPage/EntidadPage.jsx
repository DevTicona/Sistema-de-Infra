// src/pages/Entidades/EntidadPage.jsx
import React from 'react';
import { QUERY, Loading, Empty, Failure, Success } from './EntidadPage.jsx';
import Entidad from 'src/components/Entidad/Entidad';

const EntidadPage = ({ id }) => {
  return (
    <Query query={QUERY} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) {
          return <Loading />;
        }

        if (error) {
          return <Failure error={error} />;
        }

        if (data.entidad) {
          return <Success entidad={data.entidad} />;
        } else {
          return <Empty />;
        }
      }}
    </Query>
  );
};

export default EntidadPage;
