import React, { useState, useEffect } from "react";
import {MapContainer, TileLayer, Marker } from "react-leaflet";
import { PunteroMapa } from "./PunteroMapa";
import api2 from "../services/api2";
import "leaflet/dist/leaflet.css";

const Mapa = ({ direccion }) => {
  const [coordinates, setCoordinates] = useState([50,50]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerCoordenadas = async () => {
      try {
        const response = await api2.get(
          `/externos/geocache?direccion=${direccion}`
        );
        const results = response.data;

        setCoordinates(results.posicion);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener coordenadas:", error);
        setLoading(false);
      }
    };
      

    if (direccion) {
      setLoading(true);
      obtenerCoordenadas();
    }
  }, [direccion]);

  return (
    <div style={{ height: "300px", width: "100%" }}>
      {!loading && (
        <MapContainer center={coordinates} zoom={11} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker key={direccion} position={coordinates} icon={PunteroMapa} ></Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default Mapa;
