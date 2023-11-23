const express = require("express");
const router = express.Router();

const usuarioController = require("../../controllers/usuario");

router.get("/resena/:email", usuarioController.getResenas);
router.post("/resena/", usuarioController.crearResena);

module.exports = router;