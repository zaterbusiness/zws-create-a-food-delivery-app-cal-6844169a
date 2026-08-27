-- Zater Eats schema (PostgreSQL / Supabase)

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.0,
  delivery_time INTEGER NOT NULL DEFAULT 30,
  address TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  delivery_address TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL
);

-- Seed users (password below is bcrypt hash of 'password123')
INSERT INTO users (name, email, password) VALUES
('Aarav Sharma', 'aarav@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Dq1kd0e9Uv3q1x0i9OYr7Q0lC2Zvi'),
('Isha Patel', 'isha@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Dq1kd0e9Uv3q1x0i9OYr7Q0lC2Zvi'),
('Rohan Mehta', 'rohan@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Dq1kd0e9Uv3q1x0i9OYr7Q0lC2Zvi'),
('Priya Nair', 'priya@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Dq1kd0e9Uv3q1x0i9OYr7Q0lC2Zvi'),
('Kabir Singh', 'kabir@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Dq1kd0e9Uv3q1x0i9OYr7Q0lC2Zvi'),
('Ananya Rao', 'ananya@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Dq1kd0e9Uv3q1x0i9OYr7Q0lC2Zvi'),
('Vivaan Gupta', 'vivaan@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Dq1kd0e9Uv3q1x0i9OYr7Q0lC2Zvi'),
('Diya Reddy', 'diya@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Dq1kd0e9Uv3q1x0i9OYr7Q0lC2Zvi');

INSERT INTO restaurants (name, cuisine, rating, delivery_time, address, image_url) VALUES
('Spice Villa', 'North Indian', 4.5, 30, '12 MG Road, Bengaluru', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600'),
('Pizza Corner', 'Italian', 4.2, 25, '45 Park Street, Mumbai', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'),
('Sushi Zen', 'Japanese', 4.7, 40, '9 Marine Drive, Mumbai', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600'),
('Burger Hub', 'American', 4.0, 20, '78 Brigade Road, Bengaluru', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'),
('Taco Fiesta', 'Mexican', 4.3, 28, '23 Anna Salai, Chennai', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600'),
('Dragon Wok', 'Chinese', 4.1, 32, '56 Sector 17, Chandigarh', 'https://images.unsplash.com/photo-1541696490-8744a5dc0228?w=600'),
('Curry Leaf', 'South Indian', 4.6, 27, '34 Jubilee Hills, Hyderabad', 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600'),
('Sweet Tooth', 'Desserts', 4.8, 22, '67 Connaught Place, Delhi', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600');

INSERT INTO menu_items (restaurant_id, name, description, price) VALUES
(1, 'Butter Chicken', 'Creamy tomato chicken curry', 320.00),
(1, 'Paneer Tikka', 'Grilled cottage cheese cubes', 260.00),
(1, 'Garlic Naan', 'Soft leavened flatbread with garlic', 60.00),
(2, 'Margherita Pizza', 'Classic tomato and mozzarella', 350.00),
(2, 'Pepperoni Pizza', 'Loaded with pepperoni', 450.00),
(2, 'Garlic Bread', 'Toasted bread with herb butter', 150.00),
(3, 'Salmon Nigiri', 'Fresh salmon over rice', 480.00),
(3, 'California Roll', 'Crab, avocado and cucumber', 420.00),
(4, 'Classic Cheeseburger', 'Beef patty with cheese', 280.00),
(4, 'Veggie Burger', 'Grilled veg patty', 220.00),
(5, 'Chicken Tacos', 'Three soft tacos with chicken', 260.00),
(5, 'Nachos Supreme', 'Loaded nachos with cheese', 240.00),
(6, 'Hakka Noodles', 'Stir-fried veg noodles', 200.00),
(6, 'Chilli Chicken', 'Spicy indo-chinese chicken', 300.00),
(7, 'Masala Dosa', 'Crispy dosa with potato filling', 120.00),
(7, 'Idli Sambar', 'Steamed rice cakes with sambar', 90.00),
(8, 'Chocolate Lava Cake', 'Warm cake with molten centre', 180.00),
(8, 'Cheesecake Slice', 'New York style cheesecake', 200.00);

INSERT INTO orders (user_id, restaurant_id, delivery_address, total, status) VALUES
(1, 1, '101 Residency Road, Bengaluru', 380.00, 'delivered'),
(2, 2, '202 Hill Street, Mumbai', 500.00, 'preparing'),
(3, 3, '303 Sea View, Mumbai', 900.00, 'pending'),
(4, 4, '404 Church Street, Bengaluru', 500.00, 'delivered'),
(5, 5, '505 Beach Road, Chennai', 500.00, 'pending'),
(6, 6, '606 Model Town, Chandigarh', 500.00, 'preparing'),
(7, 7, '707 Banjara Hills, Hyderabad', 210.00, 'delivered'),
(8, 8, '808 Rajouri Garden, Delhi', 380.00, 'pending');

INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES
(1, 1, 1, 320.00),
(1, 3, 1, 60.00),
(2, 4, 1, 350.00),
(2, 6, 1, 150.00),
(3, 7, 1, 480.00),
(3, 8, 1, 420.00),
(4, 9, 1, 280.00),
(4, 10, 1, 220.00),
(5, 11, 1, 260.00),
(5, 12, 1, 240.00),
(6, 13, 1, 200.00),
(6, 14, 1, 300.00),
(7, 15, 1, 120.00),
(7, 16, 1, 90.00),
(8, 17, 1, 180.00),
(8, 18, 1, 200.00);
