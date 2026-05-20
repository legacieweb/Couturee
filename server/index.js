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
const generateOrderNumber = () => {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

app.post('/api/orders', async (req, res) => {
  const { user_id, customer_name, items, total, amount_paid, balance_due, payment_option, delivery_method, shipping_details, payment_reference } = req.body;
  const order_number = generateOrderNumber();
  try {
    const result = await query(
      'INSERT INTO orders (user_id, customer_name, items, total, amount_paid, balance_due, payment_option, delivery_method, shipping_details, order_number, payment_reference, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [user_id, customer_name, JSON.stringify(items), total, amount_paid, balance_due, payment_option, delivery_method, JSON.stringify(shipping_details), order_number, payment_reference, 'Processing']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/orders/claim', async (req, res) => {
  const { order_number, user_id } = req.body;
  try {
    const result = await query(
      'UPDATE orders SET user_id = $1 WHERE order_number = $2 AND user_id IS NULL RETURNING *',
      [user_id, order_number]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or already claimed' });
    }
    
    res.json({ message: 'Order claimed successfully', order: result.rows[0] });
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

app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM orders WHERE id = $1', [id]);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Users ---

app.get('/api/users', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.created_at,
        COUNT(o.id) as "totalOrders",
        COALESCE(SUM(o.total), 0) as "totalSpent"
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'user'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Delete user's orders first (if any)
    await query('DELETE FROM orders WHERE user_id = $1', [id]);
    await query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User and associated data deleted successfully' });
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
