const express = require("express");
const router = express.Router();

const productoController = require("../../controllers/producto");


router.get("/ofertados/:email", productoController.getProductsOfSeller);
router.put("/activar/:id", productoController.activateProduct);
router.get("/comprando/:email", productoController.getProductsBuying);
router.get("/ensubasta/:email?", productoController.getProductsFilter); 
router.get("/vendidos/:email", productoController.getVendidos);
router.get("/comprados/:email", productoController.getComprados);
router.put("/valorar/:id", productoController.activateValorarProduct);



module.exports = router;