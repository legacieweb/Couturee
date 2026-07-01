-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    gender VARCHAR(10),
    rating DECIMAL(2, 1),
    images TEXT[],
    variants JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE,
    user_id INTEGER REFERENCES users(id),
    customer_name VARCHAR(255),
    payment_reference VARCHAR(255),
    items JSONB NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2),
    balance_due DECIMAL(10, 2),
    payment_option VARCHAR(50),
    delivery_method VARCHAR(50),
    shipping_details JSONB,
    status VARCHAR(50) DEFAULT 'Processing',
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
