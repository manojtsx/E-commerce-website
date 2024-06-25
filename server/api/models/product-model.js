const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default : 'https://images.pexels.com/photos/821651/pexels-photo-821651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  quantity: {
    type: String,
    required: true,
  },
  createdAt : {
    type : Date,
    default : Date.now
  }
});

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
