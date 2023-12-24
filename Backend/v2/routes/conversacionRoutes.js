const express = require("express");
const router = express.Router();

const conversacionController = require("../../controllers/conversacion");

const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, conversacionController.getAllConversations); // listar conversaciones
router.post("/", authMiddleware, conversacionController.createConversation); // crear nueva conversacion
router.put("/:vendedor/:comprador/:producto", authMiddleware , conversacionController.updateConversation); // actualizar conversacion
router.put("/cerrar", conversacionController.closeConversation);

module.exports = router;
