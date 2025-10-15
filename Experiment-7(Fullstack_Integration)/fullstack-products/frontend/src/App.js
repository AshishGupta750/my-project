// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State variables to store products, loading status, and errors
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch data from the backend API
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data); // Set the fetched data to state
      } catch (err) {
        setError('Failed to fetch products. Please try again later.'); // Set error message
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchProducts();
  }, []); // The empty dependency array ensures this runs only once on mount

  // Conditional rendering based on state
  if (loading) {
    return <div className="App"><h1>Loading...</h1></div>;
  }

  if (error) {
    return <div className="App"><h1 style={{ color: 'red' }}>{error}</h1></div>;
  }

  return (
    <div className="App">
      <h1>Product List</h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <button className="buy-button">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;