-- Create database and user
CREATE DATABASE JewelccaDB;
CREATE USER postgres WITH PASSWORD 'Cem@12345';
GRANT ALL PRIVILEGES ON DATABASE JewelccaDB TO postgres;

-- Connect to the database
\c JewelccaDB;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Create tables
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(500),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    weight VARCHAR(50),
    dimensions VARCHAR(100),
    category_id BIGINT REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_materials (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    material VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_tags (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) DEFAULT 'USER',
    enabled BOOLEAN DEFAULT true,
    account_non_expired BOOLEAN DEFAULT true,
    account_non_locked BOOLEAN DEFAULT true,
    credentials_non_expired BOOLEAN DEFAULT true,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    payment_method VARCHAR(20),
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    street VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    phone VARCHAR(15),
    tracking_number VARCHAR(100),
    estimated_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);

CREATE TABLE IF NOT EXISTS offers (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    discount_percentage DECIMAL(5,2),
    code VARCHAR(50),
    image_url TEXT,
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, image_url, created_at, updated_at) VALUES
(1, 'Rings', 'rings', 'Elegant rings for every occasion', 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800', NOW(), NOW()),
(2, 'Necklaces', 'necklaces', 'Beautiful necklaces to complement your style', 'https://images.pexels.com/photos/1232166/pexels-photo-1232166.jpeg?auto=compress&cs=tinysrgb&w=800', NOW(), NOW()),
(3, 'Earrings', 'earrings', 'Stunning earrings for every face shape', 'https://images.pexels.com/photos/1324732/pexels-photo-1324732.jpeg?auto=compress&cs=tinysrgb&w=800', NOW(), NOW()),
(4, 'Bracelets', 'bracelets', 'Delicate bracelets for wrist elegance', 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800', NOW(), NOW());

-- Set sequence for categories
SELECT setval('categories_id_seq', 4, true);

-- Insert sample products
INSERT INTO products (id, name, description, price, original_price, stock_quantity, in_stock, rating, review_count, weight, dimensions, category_id, created_at, updated_at) VALUES
(1, 'Diamond Solitaire Ring', 'Elegant diamond solitaire ring crafted in 18k white gold. Perfect for engagements and special occasions.', 1299.99, 1499.99, 15, true, 4.8, 124, '3.2g', 'Size 6-8 available', 1, NOW(), NOW()),
(2, 'Pearl Drop Necklace', 'Classic pearl drop necklace with lustrous freshwater pearls. Timeless elegance for any outfit.', 899.99, null, 8, true, 4.6, 89, '12.5g', '18 inches', 2, NOW(), NOW()),
(3, 'Gold Chandelier Earrings', 'Intricate gold chandelier earrings with delicate filigree work. Perfect for special occasions.', 749.99, 849.99, 12, true, 4.7, 67, '4.8g', '2.5 inches long', 3, NOW(), NOW()),
(4, 'Silver Tennis Bracelet', 'Stunning tennis bracelet with cubic zirconia stones set in sterling silver.', 599.99, null, 20, true, 4.5, 156, '15.2g', '7 inches', 4, NOW(), NOW()),
(5, 'Rose Gold Vintage Ring', 'Vintage-inspired rose gold ring with intricate details and side diamonds.', 1599.99, null, 0, false, 4.9, 43, '4.1g', 'Size 5-9 available', 1, NOW(), NOW()),
(6, 'Sapphire Stud Earrings', 'Beautiful blue sapphire stud earrings surrounded by diamonds in white gold setting.', 999.99, null, 6, true, 4.8, 78, '2.8g', '6mm diameter', 3, NOW(), NOW());

-- Set sequence for products
SELECT setval('products_id_seq', 6, true);

-- Insert product images
INSERT INTO product_images (product_id, image_url) VALUES
(1, 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800'),
(1, 'https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=800'),
(2, 'https://images.pexels.com/photos/1232166/pexels-photo-1232166.jpeg?auto=compress&cs=tinysrgb&w=800'),
(3, 'https://images.pexels.com/photos/1324732/pexels-photo-1324732.jpeg?auto=compress&cs=tinysrgb&w=800'),
(4, 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800'),
(5, 'https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=800'),
(6, 'https://images.pexels.com/photos/1324734/pexels-photo-1324734.jpeg?auto=compress&cs=tinysrgb&w=800');

-- Insert product materials
INSERT INTO product_materials (product_id, material) VALUES
(1, '18k White Gold'), (1, 'Diamond'),
(2, 'Sterling Silver'), (2, 'Freshwater Pearls'),
(3, '14k Yellow Gold'),
(4, 'Sterling Silver'), (4, 'Cubic Zirconia'),
(5, '18k Rose Gold'), (5, 'Diamond'),
(6, '18k White Gold'), (6, 'Sapphire'), (6, 'Diamond');

-- Insert product tags
INSERT INTO product_tags (product_id, tag) VALUES
(1, 'engagement'), (1, 'wedding'), (1, 'diamond'), (1, 'luxury'),
(2, 'pearl'), (2, 'classic'), (2, 'elegant'), (2, 'formal'),
(3, 'gold'), (3, 'chandelier'), (3, 'statement'), (3, 'party'),
(4, 'silver'), (4, 'tennis'), (4, 'sparkle'), (4, 'everyday'),
(5, 'vintage'), (5, 'rose gold'), (5, 'unique'), (5, 'antique'),
(6, 'sapphire'), (6, 'stud'), (6, 'blue'), (6, 'precious');

-- Insert sample offers
INSERT INTO offers (id, title, description, discount_percentage, code, image_url, valid_from, valid_to, is_active, created_at, updated_at) VALUES
(1, 'Holiday Special - 25% Off', 'Get 25% off on all diamond jewelry. Limited time offer!', 25.00, 'HOLIDAY25', 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800', NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', true, NOW(), NOW()),
(2, 'New Year Collection', 'Explore our exclusive New Year jewelry collection with up to 30% off.', 30.00, 'NEWYEAR30', 'https://images.pexels.com/photos/1232166/pexels-photo-1232166.jpeg?auto=compress&cs=tinysrgb&w=800', NOW() - INTERVAL '1 day', NOW() + INTERVAL '45 days', true, NOW(), NOW()),
(3, 'Valentine Special', 'Show your love with our romantic jewelry collection. Special prices on heart-shaped designs.', 20.00, 'LOVE20', 'https://images.pexels.com/photos/1324732/pexels-photo-1324732.jpeg?auto=compress&cs=tinysrgb&w=800', NOW() + INTERVAL '15 days', NOW() + INTERVAL '60 days', true, NOW(), NOW());

-- Set sequence for offers
SELECT setval('offers_id_seq', 3, true);

-- Create admin user (password: admin123)
INSERT INTO users (id, first_name, last_name, email, password, role, enabled, created_at, updated_at) VALUES
(1, 'Admin', 'User', 'admin@jewelcca.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', true, NOW(), NOW());

-- Create sample customer (password: user123)
INSERT INTO users (id, first_name, last_name, email, password, role, enabled, created_at, updated_at) VALUES
(2, 'John', 'Doe', 'user@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', true, NOW(), NOW());

-- Set sequence for users
SELECT setval('users_id_seq', 2, true);

-- Create sample orders for analytics
INSERT INTO orders (id, order_number, user_id, total_amount, status, payment_method, payment_status, created_at, updated_at) VALUES
(1, 'JW-2024-001', 2, 1299.99, 'DELIVERED', 'CARD', 'COMPLETED', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days'),
(2, 'JW-2024-002', 2, 899.99, 'DELIVERED', 'UPI', 'COMPLETED', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days'),
(3, 'JW-2024-003', 2, 749.99, 'SHIPPED', 'CARD', 'COMPLETED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
(4, 'JW-2024-004', 2, 599.99, 'CONFIRMED', 'COD', 'PENDING', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day');

-- Set sequence for orders
SELECT setval('orders_id_seq', 4, true);

-- Create order items
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1, 1299.99),
(2, 2, 2, 1, 899.99),
(3, 3, 3, 1, 749.99),
(4, 4, 4, 1, 599.99);

-- Set sequence for order items
SELECT setval('order_items_id_seq', 4, true);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);