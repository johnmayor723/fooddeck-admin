const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get all orders
router.get('/', (req, res) => {
  axios.get('https://api.foodliie.com/api/orders')
    .then(response => {
      res.render('orders', { orders: response.data });
    })
    .catch(error => {
      console.error('Error fetching orders:', error);
      res.status(500).send('Server Error');
    });
});


// Get single order by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  axios.get(`https://api.foodliie.com/api/orders/orders/${id}`)
    .then(response => {
      res.render('order', { order: response.data });
    })
    .catch(error => {
      console.error('Error fetching order:', error);
      res.status(500).send('Server Error');
    });
});

// Create a new order
router.post('/create', (req, res) => {
  const { customerName, items, total, status } = req.body;
  axios.post('http://api.fooddeckpro.com.ng/api/orders', { customerName, items, total, status })
    .then(response => {
      res.redirect('/orders');
    })
    .catch(error => {
      console.error('Error creating order:', error);
      res.status(500).send('Server Error');
    });
});

// Update order status
router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  axios.post(`https://api.foodliie.com/api/orders/${id}`, { status })
    .then(response => {
      res.redirect(`/orders/${id}`);
    })
    .catch(error => {
      console.error('Error updating order:', error);
      res.status(500).send('Server Error');
    });
});

// Delete an order
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  axios.delete(`http://api.foodliie.com/api/orders/${id}`)
    .then(response => {
      res.redirect('/orders');
    })
    .catch(error => {
      console.error('Error deleting order:', error);
      res.status(500).send('Server Error');
    });
});

router.delete('/', async (req, res) => {
  const { orderId } = req.body;

  try {
    const response = await axios.delete('https://api.foodliie.com/api/orders', {
      data: { orderId },
    });

    if (response.status === 200) {
      return res.redirect('/management/orders');
    } else {
      return res.status(response.status).send('Failed to delete order.');
    }
  } catch (error) {
    console.error('Error deleting order:', error.message);
    return res.status(500).send('Server error while deleting order.');
  }
});

// POST /client/update-agent-sales
router.post('/update-agent-sales', async (req, res) => {
  const { couponCode, amount } = req.body;

  if (!couponCode || !amount) {
    return res.status(400).json({ message: 'couponCode and amount are required' });
  }

  try {
    const response = await axios.patch("https://api.foodliie.com/api/agent", {
      code:couponCode,
      amount,
    });

    res.status(200).json({
      message: 'Agent sales updated successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('Error updating agent sales:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to update agent sales',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
