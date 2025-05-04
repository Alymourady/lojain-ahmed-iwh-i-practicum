

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
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

const HUBSPOT_API_URL = 'https://api.hubapi.com/crm/v3/objects';
const CUSTOM_OBJECT = '2-44110741'; 
const ACCESS_TOKEN = process.env.HUBSPOT_TOKEN;
console.log("TOKEN CHECK:", ACCESS_TOKEN);
// GET homepage
app.get('/', async (req, res) => {
    try {
      const response = await axios.get(`${HUBSPOT_API_URL}/${CUSTOM_OBJECT}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
      });
      const records = response.data.results;
      res.render('homepage', { title: 'Home', records });
    } catch (err) {
      console.error("Error fetching custom object:", err.response?.data || err.message);
      res.status(500).send('Error loading records.');
    }
  });
  

// GET form
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form' });
});

// POST form
app.post('/update-cobj', async (req, res) => {
  const { name, kaza_2, kaza_1 } = req.body;

  try {
    await axios.post(`${HUBSPOT_API_URL}/${CUSTOM_OBJECT}`, {
      properties: {
        name,
        kaza_2,
        kaza_1
      }
    }, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });

    res.redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error creating record.');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


