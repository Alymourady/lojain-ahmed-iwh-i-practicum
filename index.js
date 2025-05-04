
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Constants
const HUBSPOT_API_URL = 'https://api.hubapi.com/crm/v3/objects';
const CUSTOM_OBJECT = '2-142319066'; // Replace with your actual custom object ID for "persons"
const ACCESS_TOKEN = process.env.HUBSPOT_TOKEN;

// =========================
// ROUTE 1 - Homepage Route
// =========================
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${HUBSPOT_API_URL}/${CUSTOM_OBJECT}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      params: {
        properties: ['name', 'amount', 'length'].join(',')
      }
    });

    const records = response.data.results;
    res.render('homepage', { title: 'Persons | HubSpot', records });

  } catch (err) {
    console.error("Error fetching custom object:", err.response?.data || err.message);
    res.status(500).send('Error loading records.');
  }
});

// ==============================
// ROUTE 2 - Display Create Form
// ==============================
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ================================
// ROUTE 3 - Submit New Record Form
// ================================
app.post('/update-cobj', async (req, res) => {
  const { name, amount, length } = req.body;

  try {
    await axios.post(`${HUBSPOT_API_URL}/${CUSTOM_OBJECT}`, {
      properties: {
        name,
        amount,
        length
      }
    }, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.redirect('/');
  } catch (err) {
    console.error("Error creating record:", err.response?.data || err.message);
    res.status(500).send('Error creating record.');
  }
});

// Server Start
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



