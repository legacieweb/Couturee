import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('-------------------------------------------');
console.log('[SERVER] Environment variables loaded from:', envPath);
console.log('[SERVER] DB URL:', process.env.DATABASE_URL ? 'Defined' : 'MISSING');
console.log('-------------------------------------------');

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// --- Authentication ---

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check for Admin credentials in .env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const user = { 
        id: 0, 
        name: 'System Admin', 
        email: process.env.ADMIN_EMAIL, 
        role: 'admin' 
      };
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
      return res.json({ user, token });
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
      delete user.password;
      res.json({ user, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Products ---

app.get('/api/products', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/products/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const result = await query(
      'UPDATE products SET stock = stock + $1 WHERE id = $2 RETURNING *',
      [amount, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, price, description, category, rating, images, variants } = req.body;
  try {
    const result = await query(
      'INSERT INTO products (name, price, description, category, rating, images, variants) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, price, description, category, rating, images, JSON.stringify(variants)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- Orders ---

app.post('/api/orders', async (req, res) => {
  const { user_id, customer_name, items, total } = req.body;
  try {
    const result = await query(
      'INSERT INTO orders (user_id, customer_name, items, total) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, customer_name, JSON.stringify(items), total]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  const { user_id } = req.query;
  try {
    let result;
    if (user_id) {
      result = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY date DESC', [user_id]);
    } else {
      result = await query('SELECT * FROM orders ORDER BY date DESC');
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log('-------------------------------------------');
  console.log(`[SERVER] Maison Backend running on port ${PORT}`);
  console.log(`[SERVER] Health Check: http://localhost:${PORT}/api/health`);
  console.log('-------------------------------------------');
});
