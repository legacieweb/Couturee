import { query } from './db.js';
import { products } from '../src/data/products.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async () => {
  try {
    console.log('Initializing database schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await query(schema);
    console.log('Schema initialized successfully.');

    console.log('Seeding products...');
    for (const product of products) {
      try {
        await query(
          'INSERT INTO products (name, price, description, category, rating, images, variants) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [
            product.name,
            product.price,
            product.description,
            product.category,
            product.rating,
            product.images,
            JSON.stringify(product.variants)
          ]
        );
        console.log(`Inserted ${product.name}`);
      } catch (error) {
        console.error(`Error inserting ${product.name}:`, error.message);
      }
    }
    console.log('Seeding completed.');
  } catch (error) {
    console.error('Initialization/Seeding failed:', error.message);
  } finally {
    process.exit();
  }
};

seed();
