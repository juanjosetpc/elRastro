const express = require("express");
const router = express.Router();

const productoController = require("../../controllers/producto");

router.get("/", productoController.getAllProducts); // listar productos
router.post("/", productoController.createProduct); // crear nuevo producto

module.exports = router;
