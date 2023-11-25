import React from 'react';
import { Marker } from 'react-leaflet';
import { PunteroMapa } from './PunteroMapa';

export const Markers = ({ places }) => {
  console.log(places);
  const marcadores = places.map((place, i) => (
    <Marker key={i} position={place} icon={PunteroMapa}></Marker>
  ));

  return <>
    {marcadores}
  </>
};
