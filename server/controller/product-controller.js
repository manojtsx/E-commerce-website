const Product = require("../models/product-model");
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) throw new Error("No Products found");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(500)
        .json({ msg: "The requested Product id doesnot exist." });
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const editProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, quantity } = req.body;
    const file = req.file;
    if(!name || !description || !price || !quantity || !file){
      throw new Error('The fields cannot be empty.');
    }
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(400)
        .json({ msg: "The requested Product id doesnot exist." });
    const imagePath = file.path;
    const isUpdated = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      image : imagePath,
      quantity,
    });
    if (!isUpdated) throw new Error("Server error. Couldnot update Product");
    res.status(200).json({ msg: "Product updated successfully;" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(400)
        .json({ msg: "The requested Product id doesnot exist." });
    const isDeleted = await Product.findByIdAndDelete(id);

    if (!isDeleted) throw new Error("Server Error.Couldnot delete Product.");
    res.status(200).json({ msg: "Product Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const file = req.file;
    if (!name || !description || !price || !quantity || !file) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    //Check for existing Product
    const product = await Product.findOne({ name  :name });
    if (product) return res.status(400).json({ msg: "Product already exists" });

    const imagePath = file.path;

    // Create new Product
    const newProduct = new Product({
      name,
      description,
      price,
      image : imagePath,
      quantity,
    });

    await newProduct.save();
    res.status(200).json({ msg: "Product created Successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
module.exports = {
  getAllProducts,
  getProductById,
  editProductById,
  deleteProductById,
  addProduct,
};
