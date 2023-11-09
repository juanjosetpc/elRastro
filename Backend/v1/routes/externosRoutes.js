const express = require("express");
const router = express.Router();

const serviciosExternosController = require("../../controllers/serviciosExternosController");

router.get("/calcular-distancia",serviciosExternosController.obtenerCoordenadas);
router.get("/huella-carbono/:distance_value",serviciosExternosController.calcularHuellaCarbono);
router.get("/cambio-divisa/:idProducto",serviciosExternosController.cambioDivisa);

module.exports = router;
