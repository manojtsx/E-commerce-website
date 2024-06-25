const Order = require('../models/order-model');
const Product = require('../models/product-model');

const getAllOrders = async (req, res) => {
  try {
    const id = req.params.userId;
    const orders = await Order.find({ userId: id });
    // Check if carts is not an array or is empty
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(404).json({msg : "Nothing has been ordered."})
    }
    
    // Assuming carts is an array with at least one order document
    // and each cart document has a products array
    let orderPromises = orders[0].products.map(item => Product.findById(item.productId));
    let products = await Promise.all(orderPromises);
    res.status(200).json({products, orderId : orders[0]._id});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteProductInOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ msg: "The selected order doesn't exists" });
    // Remove the product from the order's products
    const updatedOrders = order.products.filter(
      (product) => product.productId.toString() !== productId
    );

    // Check whether products have been updated or not
    const isArrayEqual =
      order.products.length === updatedOrders.length &&
      order.products.every((element) => updatedOrders.includes(element));
    if (isArrayEqual) {
      return res
        .status(404)
        .json({ msg: "Couldnot find the selected product in your order." });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { products: updatedOrders } },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error("Could not delete the product from order");
    }
    res.status(200).json({ msg: "Product removed from order successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const addToOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { _id, quantity } = req.body;
    let order = await Order.findOne({ userId: userId });
    if (!order) {
      order = new Order({ userId: userId, products: [] });
    }
    const existingItemIndex = order.products.findIndex(
      (item) => item.productId === _id
    );
    if (existingItemIndex > -1) {
      order.products[existingItemIndex].quantity += quantity;
    } else {
      order.products.push({ productId : _id, quantity });
    }
    await order.save();
    res.status(200).json({order,msg : "Ordered successfully"});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const deleteAllProductsFromOrder = async(req,res) =>{
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Couldnot find the order" });
    }
    // set the products array to an empty array
    order.products = [];
    await order.save();
    res
      .status(200)
      .json({ msg: "Deleted all items from order successfully", order });
  } catch (err) {
    res.status(500).json({ msg: "Deleted All Items from order Successfully" });
  }
}
module.exports = {
  getAllOrders,
  deleteProductInOrder,
  addToOrder,
  deleteAllProductsFromOrder
};
