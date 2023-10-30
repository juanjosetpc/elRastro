import  buscarDireccion  from './MapaApi';
import React, {useState, useEffect,useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import axios from 'axios';
import { useGeographic } from 'ol/proj';


const direccion = "Vialia Centro, Málaga"
const coordenadas = await buscarDireccion(direccion)


const longitude = coordenadas.lon
const latitude = coordenadas.lat

export function useGeographicCoordinates(longitude, latitude) {
  useGeographic(); // Call useGeographic inside the hook

  const [coordinates, setCoordinates] = useState([longitude, latitude]);

  useEffect(() => {
    setCoordinates([longitude, latitude]);
  }, []);

  return coordinates;
}

const MapComponent = () => {

  const geographicCoordinates = useGeographicCoordinates(longitude, latitude);

  const isMounted = useRef(true);

  useEffect(() => {

    if (isMounted.current) {
    axios
      .get('https://api.maptiler.com/maps/basic/tiles.json?key=j6HKPeHb75jzLbrTMEGy')
      .then((response) => {
        
        const { tiles } = response.data;

        // Crea una nueva capa de mosaico utilizando la fuente de MapTiler
        const tileLayer = new TileLayer({
          source: new XYZ({
            urls: tiles,
            crossOrigin: 'anonymous',
          }),
        });

        // Crea el mapa con la capa de mosaico de MapTiler
        const map = new Map({
          target: 'map',
          layers: [tileLayer],
          view: new View({
            center: geographicCoordinates, // Centro del mapa [longitud, latitud]
            zoom: 16, // Nivel de zoom inicial
          }),
        });

      })
      .catch((error) => {
        console.error('Error al obtener los tiles de MapTiler:', error);
      });
    }

    return () => {
      isMounted.current = false;
    };


  },[]);  // El arreglo vacío asegura que este efecto se ejecute solo una vez después del montaje inicial

  return <div id="map" style={{width:'50%', height:'50vh' }}></div>;
};

export default MapComponent;
