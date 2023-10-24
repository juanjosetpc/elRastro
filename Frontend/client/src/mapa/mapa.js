import React from 'react';
//import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import  buscarDireccion  from './MapaApi';

import {
    interaction, layer, custom, control, //name spaces
    Interactions, Overlays, Controls,     //group
    Map, Layers, Overlay, Util    //objects
  } from "react-openlayers";

const direccion = "Vialia Centro, Málaga"
const coordenadas = await buscarDireccion(direccion)

const MapaComponent = () => {
 
  return (
    <div>
      <h1>Mapa</h1>
      
      <Map view={{center: [coordenadas.lon,  coordenadas.lat], zoom: 1}} >
      <Layers>
        <layer.Tile></layer.Tile>
      </Layers>
     
    </Map>

  
    </div>
  );
};

export default MapaComponent;