const express = require('express');
const router = express.Router();
const axios = require('axios');

// Export a function that accepts 'upload' middleware
module.exports = (upload) => {
  // Get all products
  router.get('/', (req, res) => {
    axios.get('https://pantry-hub-server.onrender.com/api/products')
      .then(response => {
        const products = response.data;
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
    axios.get(`https://pantry-hub-server.onrender.com/api/products/${id}`)
      .then(response => {
        res.render('product', { product: response.data });
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        res.status(500).send('Server Error');
      });
  });

  // Create a new product (form submission)
  router.post('/create', upload.single('productImage'), (req, res) => {
    const { name, category, price, description, stock } = req.body;

    // Access the uploaded file's path
    const productImage = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = {
      name,
      price,
      description,
      stock,
      category,
      imageUrl: productImage
    };

    axios.post('https://pantry-hub-server.onrender.com/api/products', newProduct)
      .then(response => {
        res.redirect('/products');
      })
      .catch(error => {
        console.error('Error creating product:', error);
        res.status(500).send('Server Error');
      });
  });

  // Update a product
  router.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, price, description, imageUrl } = req.body;

    axios.put(`https://pantry-hub-server.onrender.com/api/products/${id}`, {
      name, category, price, description, imageUrl
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
  router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    axios.delete(`https://pantry-hub-server.onrender.com/api/products/${id}`)
      .then(response => {
        res.redirect('/products');
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        res.status(500).send('Server Error');
      });
  });

  return router;
};
