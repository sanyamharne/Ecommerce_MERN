const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        // default: 
        required: true,
        maxlength : 32,
        unique: true
    }
},
//timetsamps store the timestamp of any activity in the database
{timestamps: true}
);

module.exports = mongoose.model('Category', categorySchema);