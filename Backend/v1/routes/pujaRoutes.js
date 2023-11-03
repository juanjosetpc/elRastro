const express = require("express");
const router = express.Router();

const pujaController = require("../../controllers/puja");

router.get("/", pujaController.getAllPujas); // listar pujas
router.get("/:id", pujaController.getPuja); // obtener una puja
router.post("/", pujaController.createPuja); // crear nueva puja
router.put("/:id", pujaController.updatePuja); // actualizar producto
router.delete("/:id", pujaController.deletePuja); // eliminar producto

router.get("/productosVendedorPujaMasAlta/:email",pujaController.getPujasByVendedorDescByPrice); //Los productos del vendedor// del producto en el que hayas hecho tu puja mas alta
router.get("/TodasLasPujasAMisProductos/:idUsuario",pujaController.getTodasPujasAMisProductos); //todas las pujas que hayan realizado sobre todos mis productos

module.exports = router;
