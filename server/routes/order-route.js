const express = require("express");
const router = express.Router();
const orderController = require("../controller/order-controller");
const isAuthenticatedMiddleware = require("../middlware/isauthenticated-middleware");

router
.route("/user/:userId/orders")
  .get(isAuthenticatedMiddleware, orderController.getAllOrders); 
router
.route("/user/:userId/add")
  .post(isAuthenticatedMiddleware, orderController.addToOrder);
  router
  .route("/:orderId/products/:productId")
  .delete(isAuthenticatedMiddleware, orderController.deleteProductInOrder);
  router
  .route("/:orderId/products")
  .delete(isAuthenticatedMiddleware, orderController.deleteAllProductsFromOrder);

module.exports = router;
