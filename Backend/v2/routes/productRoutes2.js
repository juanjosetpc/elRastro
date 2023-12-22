const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const productoController = require("../../controllers/producto");

router.get("/ensubasta/:email?", productoController.getProductsFilter); 

router.use(authMiddleware);

router.get("/ofertados/:email", productoController.getProductsOfSeller);
router.get("/vendiendo/:email", productoController.getProductsSelling);
router.put("/activar/:id", productoController.activateProduct);
router.put("/pagar/:id", productoController.payProduct);
router.get("/comprando/:email", productoController.getProductsBuying);
router.get("/vendidos/:email", productoController.getVendidos);
router.get("/comprados/:email", productoController.getComprados);
router.put("/valorar/:id", productoController.activateValorarProduct);



module.exports = router;