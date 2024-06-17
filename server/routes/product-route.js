const express = require("express");
const router = express.Router();
const productController = require("../controller/product-controller");
const isAdminMiddleware = require("../middlware/isadmin-middleware");
const isAuthenticatedMiddleware = require("../middlware/isauthenticated-middleware");
const uploadMiddleware = require('../middlware/upload-product-image')

router.route("/products").get(productController.getAllProducts);
router.route("/:id").get(productController.getProductById);
router
  .route("/add")
  .post(
    isAuthenticatedMiddleware,
    isAdminMiddleware,
    uploadMiddleware,
    productController.addProduct
  );
router
  .route("/edit/:id")
  .put(
    isAuthenticatedMiddleware,
    isAdminMiddleware,
    uploadMiddleware,
    productController.editProductById
  );
router
  .route("/delete/:id")
  .delete(
    isAuthenticatedMiddleware,
    isAdminMiddleware,
    productController.deleteProductById
  );

module.exports = router;
