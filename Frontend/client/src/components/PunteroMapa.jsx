import L from "leaflet";

export const PunteroMapa = L.icon({
    iconUrl : require("../assets/puntero.png"),
    iconRetinaUrl : require("../assets/puntero.png"),
    iconAnchor : null,
    shadowAnchor:null,
    shadowSize: null,
    shadowUrl:null,
    iconSize : [35,35],
    className : "Leaflet-venue-icon",
})

