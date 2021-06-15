import React, { useState } from 'react';

import { MapContainer, TileLayer } from 'react-leaflet';

const initialPosition = { lat: -23.3015016, lng: -51.1842304 };

export const Map: React.FC = () => {
  const [location, setLocation] = useState(initialPosition);

  return (
    <>
      {/* <MapContainer center={location} zoom={15} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          // eslint-disable-next-line max-len
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${'pk.eyJ1IjoibWRpb3JpIiwiYSI6ImNrcHEyemkyYTAxMzkycXZ6eWJuYW5rZzAifQ.LNfFk6h7ZRiF0HfZQKYHPg'}`}
        />
      </MapContainer> */}
    </>
  );
};
