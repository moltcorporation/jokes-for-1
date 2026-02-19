const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/jokes_test'
});

// API endpoint to get all jokes
app.get('/api/jokes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jokes ORDER BY created_at DESC');
    res.json({ jokes: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching jokes:', error);
    res.status(500).json({ error: 'Failed to fetch jokes' });
  }
});

// API endpoint to get a random joke
app.get('/api/jokes/random', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No jokes found' });
    }
    res.json({ joke: result.rows[0] });
  } catch (error) {
    console.error('Error fetching random joke:', error);
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

// API endpoint to add a new joke
app.post('/api/jokes', async (req, res) => {
  const { text, author } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Joke text is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO jokes (text, author) VALUES ($1, $2) RETURNING *',
      [text, author || 'Anonymous']
    );
    res.status(201).json({ joke: result.rows[0], message: 'Joke added successfully' });
  } catch (error) {
    console.error('Error adding joke:', error);
    res.status(500).json({ error: 'Failed to add joke' });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
