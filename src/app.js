const express = require('express');
const app = express();

app.use(express.json());

// POST /users route
app.post('/users', async (req, res) => {
  const pool = require('./db');
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Name aur email dono zaroori hain!' 
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ 
        error: 'Email already exists!' 
      });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
