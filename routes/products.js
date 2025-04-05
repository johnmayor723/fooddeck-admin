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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.delete(`https://api.foodliie.com/api/products/${id}`);
    
    console.log('Delete response:', response.status, response.data);

    res.redirect('/products'); // Make sure this route exists
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code out of 2xx range
      console.error('API responded with error:', error.response.status, error.response.data);
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      // The request was made but no response received
      console.error('No response received from API:', error.request);
      res.status(500).send('No response from API');
    } else {
      // Something else went wrong
      console.error('Request setup error:', error.message);
      res.status(500).send('Error setting up request');
    }
  }
});
module.exports = router;
