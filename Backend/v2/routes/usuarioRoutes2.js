const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const usuarioController = require("../../controllers/usuario");

router.use(authMiddleware);

router.get("/:email", usuarioController.getUsuario);
router.post("/resena/", usuarioController.crearResena);

module.exports = router;