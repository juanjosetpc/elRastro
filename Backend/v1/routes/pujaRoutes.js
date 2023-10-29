const express = require("express");
const router = express.Router();

const pujaController = require("../../controllers/puja");

router.get("/", pujaController.getAllPujas); // listar pujas
router.post("/", pujaController.createPuja); // crear nueva puja
router.put("/:id", pujaController.updatePuja); // actualizar producto
router.delete("/:id", pujaController.deletePuja); // eliminar producto


module.exports = router;
