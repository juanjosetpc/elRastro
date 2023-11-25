const express = require("express");
const router = express.Router();

const productoController = require("../../controllers/producto");


router.get("/ofertados/:email", productoController.getProductsOfSeller);//Obtener los productos ofertados por un usuario (en venta o aún no en venta)
router.put("/activar/:id", productoController.activateProduct);
router.get("/comprando/:email", productoController.getProductsBuying);
router.get("/ensubasta", productoController.getProductsFilter); 
router.get("/vendidos/:email", productoController.getVendidos);
router.get("/comprados/:email", productoController.getComprados);
router.put("/valorar/:id", productoController.activateValorarProduct);



module.exports = router;