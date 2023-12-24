const express = require("express");
const router = express.Router();
const serviciosExternosController = require("../../controllers/serviciosExternosController");

const authMiddleware = require("../../middleware/authMiddleware");

router.get("/geocache",serviciosExternosController.geocache);
router.get("/huella-carbono", authMiddleware , serviciosExternosController.calculaCarbonoDadosLosLugares);


module.exports = router;