const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.get('/search-location', async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
      },
    });

    const locations = response.data; // Array de resultados de ubicaciones

    res.json({ locations });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al buscar la ubicación en OpenStreetMap' });
  }
});

