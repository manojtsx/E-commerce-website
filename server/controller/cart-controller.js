const Cart = require("../models/cart-model");
const Product  = require("../models/product-model")
const getAllCarts = async (req, res) => {
  try {
    const id = req.params.userId;
    const carts = await Cart.find({ userId: id });

    // Check if carts is not an array or is empty
    if (!Array.isArray(carts) || carts.length === 0) {
      throw new Error('You do not have any item in cart');
    }

    // Assuming carts is an array with at least one cart document
    // and each cart document has a products array
    let productPromises = carts[0].products.map(item => Product.findById(item.productId));
    let products = await Promise.all(productPromises);

    res.status(200).json({ products, cartId: carts[0]._id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteProductInCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const cart = await Cart.findById(cartId);
    if (!cart)
      return res.status(404).json({ msg: "The selected cart doesn't exists" });
    // Remove the product from the cart's products
    const updatedProducts = cart.products.filter(
      (product) => product.productId.toString() !== productId
    );

    // Check whether products have been updated or not
    const isArrayEqual =
      cart.products.length === updatedProducts.length &&
      cart.products.every((element) => updatedProducts.includes(element));
    if (isArrayEqual) {
      return res
        .status(404)
        .json({ msg: "Couldnot find the selected product in your cart." });
    }
    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { $set: { products: updatedProducts } },
      { new: true }
    );

    if (!updatedCart) {
      throw new Error("Could not delete the product from cart");
    }
    res.status(200).json({ msg: "Product removed from cart successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const addToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { _id, quantity } = req.body;
    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      cart = new Cart({ userId: userId, products: [] });
    }
    const existingItemIndex = cart.products.findIndex(
      (item) => item.productId === _id
    );
    
    if (existingItemIndex > -1) {
      cart.products[existingItemIndex].quantity += quantity;
    } else {
      cart.products.push({ productId : _id, quantity });
    }
    await cart.save();
    res.status(200).json({cart,msg : 'Added to cart successfully'});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const deleteAllProductsFromCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ msg: "Couldnot find the cart" });
    }
    // set the products array to an empty array
    cart.products = [];
    await cart.save();
    res
      .status(200)
      .json({ msg: "Deleted all items from cart successfully", cart });
  } catch (err) {
    res.status(500).json({ msg: "Deleted All Items from Cart Successfully" });
  }
};
module.exports = {
  getAllCarts,
  deleteProductInCart,
  addToCart,
  deleteAllProductsFromCart,
};
