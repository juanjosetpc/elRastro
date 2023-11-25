const express = require("express");
const router = express.Router();

const conversacionController = require("../../controllers/conversacion");

router.get("/", conversacionController.getAllConversations); // listar conversaciones
router.post("/", conversacionController.createConversation); // crear nueva conversacion
router.put("/:vendedor/:comprador/:producto", conversacionController.updateConversation); // actualizar conversacion
router.put("/:vendeor/:comprador/:producto", conversacionController.closeConversation);

module.exports = router;
