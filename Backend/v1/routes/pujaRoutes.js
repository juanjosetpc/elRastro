const express = require("express");
const router = express.Router();

const pujaController = require("../../controllers/puja");

router.get("/", pujaController.getAllPujas); // listar pujas
router.post("/:pujaId", pujaController.createPuja); // crear nueva puja

module.exports = router;
