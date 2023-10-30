const express = require("express");
const router = express.Router();

const serviciosExternosController = require("../../controllers/serviciosExternosController");

router.get("/productos", serviciosExternosController.getAllProducts); // lista los productos de la api externa.
// router.post("/productos", serviciosExternosController.createProducts); // añade los productos a la bd adaptando los campos que faltan.

router.get('/calcular-distancia/:lugar1/:lugar2', serviciosExternosController.obtenerCoordenadas);

router.post("/huella-carbono/:distance_value", serviciosExternosController.calcularHuellaCarbono);

module.exports = router;
