const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const serviciosExternosController = require("../../controllers/serviciosExternosController");

router.use(authMiddleware);

router.get("/calcular-distancia",serviciosExternosController.obtenerCoordenadas);
router.get("/huella-carbono/:distance_value",serviciosExternosController.calcularHuellaCarbono);
router.get("/cambio-divisa/:idProducto",serviciosExternosController.cambioDivisa);

module.exports = router;
