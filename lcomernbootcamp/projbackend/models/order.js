const mongoose = require('mongoose');
//creating an object of type Schema.
const {ObjectId} = mongoose.Schema;


//Defining productcartSchema in the same file as order.js
const productcartSchema= new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
})

const orderSchema = new mongoose.Schema({
    products: [productcartSchema],
    transaction_id: {},
    amount: {
        type: Number
    },
    address: {
        type: String,
    },
    updated: {
        type: Date
    },
    status: {
        type: String,
        default: "Recieved",
        enum: ["Delievered", "Canceled", "Shipped", "processing", "Recieved"]
    },
    user: {
        type: ObjectId,
        ref: "User"
    }
},
{timestamps: true});
const Order = mongoose.model('Order', orderSchema);
const ProductCart = mongoose.model('ProductCart', productcartSchema);
//exporting schemas.
module.exports = {Order, ProductCart};