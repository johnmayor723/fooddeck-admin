const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get all products

router.get('/', (req, res) => {
  axios.get('https://api.foodliie.com/api/products')
    .then(response => {
      const products = response.data
      console.log(products)
      res.render('products', { products });
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      res.status(500).send('Server Error');
    });
});

// Get single product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  axios.get(`https://api.foodliie.com/api/products/${id}`)
    .then(response => {
      res.render('product', { product: response.data });
    })
    .catch(error => {
      console.error('Error fetching product:', error);
      res.status(500).send('Server Error');
    });
});

//const axios = require('axios');

// Create a new product (form submission)
router.post('/create', (req, res) => {
  const { name, category, price, description, imageUrl, stock, measurements } = req.body;

const parsedMeasurements = measurements || [];
  axios.post('https://api.foodliie.com/api/products', {
      name,
      category,
      price,
      description,
      imageUrl,
      stock,
      measurements: parsedMeasurements
    })
    .then(response => {
      res.render('products', { products: response.data });
    })
    .catch(error => {
      console.error('Error creating product:', error);
      res.status(500).send('Server Error');
    });
});

// Update a product
router.put('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, imageUrl, measurements } = req.body;

  const parsedMeasurements = measurements || [];

  axios.put(`https://api.foodliie.com/api/products/${id}`, {
      name,
      category,
      price,
      description,
      imageUrl,
      measurements: parsedMeasurements
    })
    .then(response => {
      res.redirect(`/products/${id}`);
    })
    .catch(error => {
      console.error('Error updating product:', error);
      res.status(500).send('Server Error');
    });
});

// Delete a product
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  axios.delete(`https://api.foodliie.com/api/products/${id}`)
    .then(response => {
      res.redirect('products');
    })
    .catch(error => {
      console.error('Error deleting product:', error);
      res.status(500).send('Server Error');
    });
});

module.exports = router;
