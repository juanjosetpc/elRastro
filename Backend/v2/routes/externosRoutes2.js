const express = require("express");
const router = express.Router();
const serviciosExternosController = require("../../controllers/serviciosExternosController");

router.get("/geocache",serviciosExternosController.geocache);

module.exports = router;