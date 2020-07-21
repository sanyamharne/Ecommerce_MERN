const mongoose = require('mongoose');
// creating an object of type schema to link it with the category schema
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description : {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: true,
        maxlength: 32,
        trim: true
    },
    category:{
        type: ObjectId,
        //referencing to the categroy_Schema
        ref: "Category",
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    sold: {
        type : Number,
        default:0
    },
    //storing images into the database
    photo: {
        data: Buffer,
        contentType: String
    }
},
{timestamps: true}
);

module.exports = mongoose.model('Product', productSchema);