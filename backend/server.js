// backend/server.js
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'users_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
async function ensureSchema() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        uuid VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL
      )
    `);
  } finally {
    conn.release();
  }
}
ensureSchema().catch(console.error);
app.get('/', (req, res) => {
  res.send('User Management API is running');
});
app.post('/api/users/fetch', async (req, res) => {
  try {
    const target = 1000;
    const batchSize = 50;
    let inserted = 0;
    let page = 1;

    const conn = await pool.getConnection();
    try {
      while (inserted < target) {
        const remaining = target - inserted;
        const take = Math.min(batchSize, remaining);

        const url = `https://randomuser.me/api/?results=${take}&page=${page}`;
        const { data } = await axios.get(url);

        if (!data || !Array.isArray(data.results) || data.results.length === 0) {
          break;
        }

        const rows = data.results
          .map(u => {
            const uuid = u?.login?.uuid || '';
            const name = `${u?.name?.first || ''} ${u?.name?.last || ''}`.trim();
            const email = u?.email || '';
            const city = u?.location?.city || '';
            return [uuid, name, email, city];
          })
          .filter(r => r[0] && r[1] && r[2] && r[3]);

        if (rows.length === 0) break;

        const sql = `
          INSERT INTO users (uuid, name, email, city)
          VALUES ?
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            email = VALUES(email),
            city = VALUES(city)
        `;
        await conn.query(sql, [rows]);

        inserted += rows.length;
        page += 1;
      }

      res.json({ message: `Inserted or updated ${inserted} users` });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Fetch failed:', err);
    res.status(500).json({ error: 'Fetch failed', details: String(err.message || err) });
  }
});
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT uuid, name, email, city FROM users ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('List users failed:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});
app.put('/api/users/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, email, city } = req.body;

    if (!uuid) return res.status(400).json({ error: 'UUID is required' });
    if (!name || !email || !city) return res.status(400).json({ error: 'Name, email, and city are required' });

    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, city = ? WHERE uuid = ?',
      [name, email, city, uuid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
