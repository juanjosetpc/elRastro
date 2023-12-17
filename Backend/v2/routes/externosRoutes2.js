const express = require("express");
const router = express.Router();
const serviciosExternosController = require("../../controllers/serviciosExternosController");

const authMiddleware = require("../../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/geocache",serviciosExternosController.geocache);

module.exports = router;