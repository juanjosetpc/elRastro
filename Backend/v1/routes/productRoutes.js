const express = require("express");
const router = express.Router();

const productoController = require("../../controllers/producto");

router.get("/", productoController.getAllProducts); // listar productos
router.post("/", productoController.createProduct); // crear nuevo producto
router.put("/:id", productoController.updateProduct); // actualizar producto
router.delete("/:id", productoController.deleteProduct); // eliminar producto

router.get(
  "/subasta/:descripcion",
  productoController.getProductsByDescription
); //Producto en subasta a partir de (parte de ) su descripción
router.get("/ofertados/:email", productoController.getProductsByUserDescByDate); //Obtener productos ofertados por un usuario descendente por fecha de inicio

module.exports = router;
