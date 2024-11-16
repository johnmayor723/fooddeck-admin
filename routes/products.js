const express = require('express');
const router = express.Router();
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Helper function to parse and sanitize measurements
const parseMeasurements = (measurements) => {
  if (!measurements) return [];
  const parsedMeasurements = typeof measurements === 'string' ? JSON.parse(measurements) : measurements;

  return parsedMeasurements.map((measurement) => ({
    ...measurement,
    id: measurement.id || uuidv4(), // Retain existing ID or generate a new one
    price: parseFloat(measurement.price), // Ensure price is a number
    unit: parseInt(measurement.unit, 10), // Ensure unit is a number
  }));
};

// Get all products
router.get('/', (req, res) => {
  axios.get('https://pantry-hub-server.onrender.com/api/products')
    .then((response) => {
      const products = response.data;
      res.render('products', { products });
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
      res.status(500).send('Server Error');
    });
});

// Get single product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  axios.get(`https://pantry-hub-server.onrender.com/api/products/${id}`)
    .then((response) => {
      res.render('product', { product: response.data });
    })
    .catch((error) => {
      console.error('Error fetching product:', error);
      res.status(500).send('Server Error');
    });
});

// Create a new product (form submission)
router.post('/create', (req, res) => {
  const { name, category, price, description, imageUrl, stock, measurements } = req.body;

  const measurementsWithIds = parseMeasurements(measurements);

  axios.post('https://pantry-hub-server.onrender.com/api/products/', {
      name,
      category,
      price: parseFloat(price), // Ensure price is a number
      description,
      imageUrl,
      stock: parseInt(stock, 10), // Ensure stock is a number
      measurements: measurementsWithIds,
    })
    .then((response) => {
      res.redirect('/products');
    })
    .catch((error) => {
      console.error('Error creating product:', error);
      res.status(500).send('Server Error');
    });
});

// Update a product
router.put('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, imageUrl, stock, measurements } = req.body;

  const measurementsWithIds = parseMeasurements(measurements);

  axios.put(`https://pantry-hub-server.onrender.com/api/products/${id}`, {
      name,
      category,
      price: parseFloat(price), // Ensure price is a number
      description,
      imageUrl,
      stock: parseInt(stock, 10), // Ensure stock is a number
      measurements: measurementsWithIds,
    })
    .then((response) => {
      res.redirect(`/products/${id}`);
    })
    .catch((error) => {
      console.error('Error updating product:', error);
      res.status(500).send('Server Error');
    });
});

// Delete a product
router.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  axios.delete(`https://pantry-hub-server.onrender.com/api/products/${id}`)
    .then((response) => {
      res.redirect('/products');
    })
    .catch((error) => {
      console.error('Error deleting product:', error);
      res.status(500).send('Server Error');
    });
});

module.exports = router;
