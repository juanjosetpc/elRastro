const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const usuarioController = require("../../controllers/usuario");

router.use(authMiddleware);

router.get("/:email", usuarioController.getUsuario);
//router.get("/resena/:email", usuarioController.getResenas);
router.post("/resena/", usuarioController.crearResena);
//router.get("/valoracion/:email", usuarioController.getValoracion);

module.exports = router;