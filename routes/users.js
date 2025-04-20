const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_BASE_URL = 'https://api.foodliie.com'; // Change to your actual API base URL

// GET /users - List all users
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth`);
    const users = response.data.data || []; // assuming `data` contains the users array
    res.render('users', { users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).send('Error loading users');
  }
});
/*router.delete('/', async (req, res) => {
  const { email } = req.body;

  try {
    const response = await axios.delete('https://api.foodliie.com/api/auth', {
      data: { email },
    });

    if (response.status === 200) {
      return res.redirect('/');
    } else {
      return res.status(response.status).send('Failed to delete user.');
    }
  } catch (error) {
    console.error('Error deleting user:', error.message);
    return res.status(500).send('Server error while deleting user.');
  }
});*/

module.exports = router;
