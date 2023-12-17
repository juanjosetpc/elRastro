const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const productoController = require("../../controllers/producto");

router.use(authMiddleware); 
//Querys simples sobre productos
router.get("/ensubasta", productoController.getProductsByDescription); //Producto en subasta a partir de (parte de ) su descripción
router.get("/ofertados/:email", productoController.getProductsByUserDescByDate); //Obtener productos ofertados por un usuario descendente por fecha de inicio

//CRUD de productos. Se pone despues de las rutas anteriores para que no interfiera con ellas
router.get("/", productoController.getAllProducts); // listar productos
router.get("/:id", productoController.getProduct); // obtener un producto
router.post("/", productoController.createProduct); // crear nuevo producto
router.put("/:id", productoController.updateProduct); // actualizar producto
router.delete("/:id", productoController.deleteProduct); // eliminar producto
router.put("/:id/addfoto", productoController.addfoto); 


module.exports = router;
