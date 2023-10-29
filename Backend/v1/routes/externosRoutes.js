const express = require("express");
const router = express.Router();

const serviciosExternosController = require("../../controllers/serviciosExternosController");

router.get("/productos", serviciosExternosController.getAllProducts); // lista los productos de la api externa.
// router.post("/productos", serviciosExternosController.createProducts); // añade los productos a la bd adaptando los campos que faltan.

module.exports = router;
