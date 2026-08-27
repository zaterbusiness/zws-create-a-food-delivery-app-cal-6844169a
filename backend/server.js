const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_secret';

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing authentication token.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

app.get('/', (req, res) => res.json({ status: 'Zater Eats API running' }));

app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || name.trim().length < 2) return res.status(400).json({ error: 'Name is required.' });
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required.' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const { data: existing } = await supabase.from('users').select('id').eq('email', email.toLowerCase()).maybeSingle();
    if (existing) return res.status(409).json({ error: 'Email already registered.' });

    const hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert({ name: name.trim(), email: email.toLowerCase(), password: hash })
      .select('id, name, email')
      .single();
    if (error) return res.status(500).json({ error: error.message });

    const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials.' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/restaurants', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('restaurants').select('*').order('rating', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/restaurants/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('restaurants').select('*').eq('id', req.params.id).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Restaurant not found.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/restaurants/:id/menu', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', req.params.id)
      .order('id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/orders', authMiddleware, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, restaurants(name)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });

    const ids = orders.map((o) => o.id);
    let itemsByOrder = {};
    if (ids.length) {
      const { data: items, error: itemErr } = await supabase
        .from('order_items')
        .select('*, menu_items(name, price)')
        .in('order_id', ids);
      if (itemErr) return res.status(500).json({ error: itemErr.message });
      items.forEach((it) => {
        (itemsByOrder[it.order_id] = itemsByOrder[it.order_id] || []).push({
          name: it.menu_items ? it.menu_items.name : 'Item',
          price: it.price,
          quantity: it.quantity,
        });
      });
    }
    const result = orders.map((o) => ({
      id: o.id,
      status: o.status,
      total: o.total,
      delivery_address: o.delivery_address,
      restaurant_name: o.restaurants ? o.restaurants.name : null,
      items: itemsByOrder[o.id] || [],
      created_at: o.created_at,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/orders', authMiddleware, async (req, res) => {
  try {
    const { restaurant_id, delivery_address, items } = req.body;
    if (!restaurant_id) return res.status(400).json({ error: 'restaurant_id is required.' });
    if (!delivery_address || delivery_address.trim().length < 5) return res.status(400).json({ error: 'Valid delivery address required.' });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Order must contain items.' });

    const menuIds = items.map((i) => i.menu_item_id);
    const { data: menuRows, error: menuErr } = await supabase
      .from('menu_items')
      .select('id, price')
      .in('id', menuIds);
    if (menuErr) return res.status(500).json({ error: menuErr.message });

    const priceMap = {};
    menuRows.forEach((m) => { priceMap[m.id] = m.price; });
    let total = 0;
    for (const it of items) {
      if (!priceMap[it.menu_item_id]) return res.status(400).json({ error: 'Invalid menu item in order.' });
      if (!it.quantity || it.quantity < 1) return res.status(400).json({ error: 'Invalid item quantity.' });
      total += priceMap[it.menu_item_id] * it.quantity;
    }

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({ user_id: req.user.id, restaurant_id, delivery_address: delivery_address.trim(), total, status: 'pending' })
      .select('*')
      .single();
    if (orderErr) return res.status(500).json({ error: orderErr.message });

    const orderItems = items.map((it) => ({
      order_id: order.id,
      menu_item_id: it.menu_item_id,
      quantity: it.quantity,
      price: priceMap[it.menu_item_id],
    }));
    const { error: oiErr } = await supabase.from('order_items').insert(orderItems);
    if (oiErr) return res.status(500).json({ error: oiErr.message });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/orders/:id', authMiddleware, async (req, res) => {
  try {
    const { status, delivery_address } = req.body;
    const allowed = ['pending', 'preparing', 'delivered', 'cancelled'];
    const update = {};
    if (status) {
      if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status.' });
      update.status = status;
    }
    if (delivery_address) {
      if (delivery_address.trim().length < 5) return res.status(400).json({ error: 'Valid delivery address required.' });
      update.delivery_address = delivery_address.trim();
    }
    if (Object.keys(update).length === 0) return res.status(400).json({ error: 'Nothing to update.' });

    const { data, error } = await supabase
      .from('orders')
      .update(update)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select('*')
      .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Order not found.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/orders/:id', authMiddleware, async (req, res) => {
  try {
    const { data: order, error: findErr } = await supabase
      .from('orders')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle();
    if (findErr) return res.status(500).json({ error: findErr.message });
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    await supabase.from('order_items').delete().eq('order_id', req.params.id);
    const { error } = await supabase.from('orders').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Zater Eats API listening on port ${PORT}`));
