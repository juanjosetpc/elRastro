

// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import axios from "axios";

// import "leaflet/dist/leaflet.css";

// const Mapa = ({ direccion }) => {
//   const [hue, setHue] = useState(0);
//   const color = `hsl(${hue % 360}deg 39% 70%)`;
//   const [coordinates, setCoordinates] = useState([50, 50]);
//   const [loading, setLoading] = useState(true);
//   const [mapCenter, setMapCenter] = useState([50, 50]);

//   const obtenerCoordenadas = async () => {
//     try {
//       const apiUrl1 = `https://nominatim.openstreetmap.org/search?q=${direccion}&format=json&limit=1`;
//       const [response1] = await Promise.all([axios.get(apiUrl1)]);
//       const results = response1.data[0];

//       console.log("Las coordenadas son : " + results.lat + "   " + results.lon);

//       setLoading(false);
//       setCoordinates([results.lat, results.lon]);
//       setMapCenter([results.lat, results.lon]); // Actualiza el centro del mapa aquí
//     } catch (error) {
//       console.error("Error al obtener coordenadas:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (direccion) {
//       setLoading(true);
//       obtenerCoordenadas();
//     }
//   }, [direccion]);

//   return (
//     <MapContainer
//       style={{ height: "300px", width: "100%" }}
//       center={mapCenter} // Usa el centro del mapa dinámico
//       zoom={11}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       {!loading && (
//         <Marker key={direccion} position={coordinates}>
//           <Popup>aqui</Popup>
//         </Marker>
//       )}
//     </MapContainer>
//   );
// };

// export default Mapa;

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import {PunteroMapa} from "./PunteroMapa";
import "leaflet/dist/leaflet.css";

const Mapa = ({ direccion }) => {
  const [coordinates, setCoordinates] = useState([50, 50]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerCoordenadas = async () => {
      try {
        const apiUrl1 = `https://nominatim.openstreetmap.org/search?q=${direccion}&format=json&limit=1`;
        const [response1] = await Promise.all([axios.get(apiUrl1)]);
        const results = response1.data[0];

        console.log("Las coordenadas son : " + results.lat + "   " + results.lon);

        setCoordinates([results.lat, results.lon]);
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
          <Marker key={direccion} position={coordinates} icon={PunteroMapa} >
            <Popup>aqui</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default Mapa;
