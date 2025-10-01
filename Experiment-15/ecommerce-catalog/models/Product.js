const mongoose = require('mongoose');


const VariantSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    }
});


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
   
    variants: [VariantSchema]
});

module.exports = mongoose.model('Product', ProductSchema);