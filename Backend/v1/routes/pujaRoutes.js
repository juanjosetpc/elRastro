const express = require("express");
const router = express.Router();

const pujaController = require("../../controllers/puja");

router.get("/", pujaController.getAllPujas); // listar pujas
router.post("/", pujaController.createPuja); // crear nueva puja
router.put("/:id", pujaController.updatePuja); // actualizar producto
router.delete("/:id", pujaController.deletePuja); // eliminar producto
router.get("/productosVendedorPujaMasAlta/:email",pujaController.getPujasByVendedorDescByPrice); //Los productos del vendedor 
                                                                                                // del producto en el que hayas hecho tu puja mas alta


module.exports = router;
