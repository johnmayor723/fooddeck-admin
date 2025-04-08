const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_BASE_URL = 'https://api.foodliie.com'; // Change to your actual API base URL

// GET /agents - List all agents
router.get('/agents', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/agents`);
    const agents = response.data;
    res.render('agents', { agents });
  } catch (error) {
    console.error('Error fetching agents:', error.message);
    res.status(500).send('Error loading agents');
  }
});
// find by id
router.post('/find-by-email', async (req, res) => {
  const { email } = req.body;

  try {
    const response = await axios.post(`${API_BASE_URL}/api/agents/find-by-email`, { email });
    const agent = response.data.agent;
    res.render('agent', { agent });
  } catch (error) {
    console.error('Error fetching agent:', error.response?.data || error.message);
    res.status(500).send('Agent not found');
  }
});
// POST /update-agent-sales - Submit form to update sales via API
router.post('/update-agent-sales', async (req, res) => {
  const { couponCode, amount } = req.body;

  try {
    const response = await axios.patch(`${API_BASE_URL}/api/agent`, {
      couponCode,
      amount,
    });

    const updatedAgent = response.data.agent;
    res.redirect(`/agents/${updatedAgent._id}`);
  } catch (error) {
    console.error('Error updating sales:', error.response?.data || error.message);
    res.status(500).send('Failed to update agent sales');
  }
});

module.exports = router;
