const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart-controller");
const isAuthenticatedMiddleware = require("../middlware/isauthenticated-middleware");

router
  .route("/user/:userId/carts")
  .get(isAuthenticatedMiddleware, cartController.getAllCarts);
router
  .route("/user/:userId/add")
  .post(isAuthenticatedMiddleware, cartController.addToCart);
router
  .route("/:cartId/products/:productId")
  .delete(isAuthenticatedMiddleware, cartController.deleteProductInCart);
router
  .route("/:cartId/products")
  .delete(isAuthenticatedMiddleware, cartController.deleteAllProductsFromCart);

module.exports = router;
