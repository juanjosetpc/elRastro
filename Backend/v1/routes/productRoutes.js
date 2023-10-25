const express = require("express");
const router = express.Router();

const productoController = require("../../controllers/producto");

router.get("/", productoController.getAllProducts); // listar productos
router.post("/", productoController.createProduct); // crear nuevo producto
router.put("/:email/:titulo", productoController.updateProduct); // actualizar producto
router.delete("/:email/:titulo", productoController.deleteProduct); // eliminar producto

router.get("/ofertados/:email", productoController.getProductsByUserDescByDate); //Obtener productos ofertados por un usuario descendente por fecha de inicio
router.get(
  "/subasta/:descripcion",
  productoController.getProductsByDescription
); //Producto en subasta a partir de (parte de ) su descripción

module.exports = router;
