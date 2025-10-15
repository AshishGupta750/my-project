// backend/server.js

const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000; // You can use any port

// Use CORS middleware
app.use(cors());

// Define the product data
const products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Mouse', price: 25 },
  { id: 3, name: 'Keyboard', price: 45 }
];

// Create an API endpoint to get the products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Backend server is running at http://localhost:${port}`);
});