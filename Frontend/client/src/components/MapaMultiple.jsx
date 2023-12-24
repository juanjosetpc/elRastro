import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import {Markers} from './Markers';
import api2 from '../services/api2';
import 'leaflet/dist/leaflet.css';

const MapaMultiple = ({ direcciones, filtrarMapa }) => {
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const obtenerCoordenadas = async () => {
      try {
        const nuevosMarkers = [];

        for (const direccion of direcciones) {

          const response = await api2.get(`/externos/geocache?direccion=${direccion}`);
          const result = response.data;
          nuevosMarkers.push(result.posicion);
        }

        setMarkers(nuevosMarkers);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener coordenadas:', error);
        setLoading(false);
      }
    };

    if (filtrarMapa && direcciones.length > 0) {
      setLoading(true);
      obtenerCoordenadas();
    } else {
      setLoading(false);
    }

  }, [direcciones, filtrarMapa]);

  return (
    <div style={{ height: "300px", width: "100%" }}>
      {!loading && (
        <MapContainer
          center={markers[0] ? markers[0] : [50,50]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Markers places={markers}></Markers>
        </MapContainer>
      )}
    </div>
  );
};

export default MapaMultiple;