const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    products : [{
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product',
            required : true
        },
        quantity : {
            type : String,
            required : true,
            default : 1
        }
    }],
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

const Order = mongoose.model('order',OrderSchema);
module.exports = Order;