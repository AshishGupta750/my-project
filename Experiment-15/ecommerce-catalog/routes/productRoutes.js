const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/category/:categoryName', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.categoryName });
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found in this category' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/by-color/:color', async (req, res) => {
    try {
        
        const products = await Product.find({ 'variants.color': req.params.color });
         if (products.length === 0) {
            return res.status(404).json({ message: 'No products found with this variant color' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;