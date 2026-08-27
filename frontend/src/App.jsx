import React, { useState, useEffect } from 'react';

const styles = {
  app: { fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f7f7f7', color: '#222' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', background: '#e23744', color: '#fff', position: 'sticky', top: 0, zIndex: 10 },
  logo: { fontWeight: 'bold', fontSize: 24, letterSpacing: 0.5 },
  navRight: { display: 'flex', alignItems: 'center', gap: 16 },
  cartBtn: { background: '#fff', color: '#e23744', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  authWrap: { display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#e23744,#ff7e5f)' },
  card: { background: '#fff', padding: 32, borderRadius: 14, width: 360, boxShadow: '0 20px 50px rgba(0,0,0,0.25)' },
  input: { width: '100%', padding: 12, margin: '8px 0', border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box', fontSize: 14 },
  btn: { width: '100%', padding: 12, background: '#e23744', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 15, marginTop: 8 },
  link: { color: '#e23744', cursor: 'pointer', textAlign: 'center', marginTop: 14, fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20, padding: 24 },
  restCard: { background: '#fff', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform .15s' },
  restImg: { width: '100%', height: 150, objectFit: 'cover' },
  badge: { background: '#48c479', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontWeight: 600 },
  search: { padding: '16px 24px', display: 'flex', gap: 12, flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: 200, padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 15 },
  menuItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: 16, borderRadius: 10, marginBottom: 12 },
  addBtn: { background: '#fff', color: '#e23744', border: '1px solid #e23744', padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 },
  drawer: { position: 'fixed', top: 0, right: 0, width: 360, maxWidth: '90vw', height: '100vh', background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.2)', zIndex: 20, padding: 20, display: 'flex', flexDirection: 'column' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 15 },
  cartRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' },
  qtyBtn: { width: 26, height: 26, border: '1px solid #e23744', background: '#fff', color: '#e23744', borderRadius: 4, cursor: 'pointer', fontWeight: 700 },
  chip: { padding: '6px 14px', borderRadius: 20, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' },
};

const API = 'https://api.zatereats.example/api';

const MOCK_RESTAURANTS = [
  { id: 1, name: 'Spice Villa', cuisine: 'Indian', rating: 4.5, eta: 30, price: 250, cat: 'Indian', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400' },
  { id: 2, name: 'Pizza Republic', cuisine: 'Italian', rating: 4.2, eta: 25, price: 400, cat: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
  { id: 3, name: 'Sushi Zen', cuisine: 'Japanese', rating: 4.7, eta: 40, price: 600, cat: 'Japanese', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
  { id: 4, name: 'Burger Barn', cuisine: 'American', rating: 4.0, eta: 20, price: 300, cat: 'Burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { id: 5, name: 'Green Bowl', cuisine: 'Healthy', rating: 4.3, eta: 35, price: 350, cat: 'Healthy', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
  { id: 6, name: 'Taco Fiesta', cuisine: 'Mexican', rating: 4.1, eta: 28, price: 280, cat: 'Mexican', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
];

const MOCK_MENU = {
  1: [{ id: 101, name: 'Butter Chicken', price: 320 }, { id: 102, name: 'Paneer Tikka', price: 260 }, { id: 103, name: 'Garlic Naan', price: 60 }],
  2: [{ id: 201, name: 'Margherita Pizza', price: 400 }, { id: 202, name: 'Pepperoni Pizza', price: 480 }, { id: 203, name: 'Garlic Bread', price: 150 }],
  3: [{ id: 301, name: 'Salmon Roll', price: 550 }, { id: 302, name: 'Tuna Nigiri', price: 480 }, { id: 303, name: 'Miso Soup', price: 180 }],
  4: [{ id: 401, name: 'Classic Burger', price: 250 }, { id: 402, name: 'Cheese Fries', price: 150 }, { id: 403, name: 'Milkshake', price: 180 }],
  5: [{ id: 501, name: 'Quinoa Bowl', price: 350 }, { id: 502, name: 'Caesar Salad', price: 300 }, { id: 503, name: 'Smoothie', price: 200 }],
  6: [{ id: 601, name: 'Chicken Tacos', price: 280 }, { id: 602, name: 'Nachos', price: 220 }, { id: 603, name: 'Guacamole', price: 120 }],
};

const CATEGORIES = ['All', 'Indian', 'Pizza', 'Japanese', 'Burger', 'Healthy', 'Mexican'];

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [authErr, setAuthErr] = useState('');

  const [restaurants, setRestaurants] = useState([]);
  const [menu, setMenu] = useState({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('home');

  useEffect(() => {
    const saved = localStorage.getItem('zater_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`${API}/restaurants`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setRestaurants(data);
      } catch {
        setRestaurants(MOCK_RESTAURANTS);
      }
    }
    load();
  }, [user]);

  async function openRestaurant(r) {
    setSelected(r);
    setView('menu');
    if (menu[r.id]) return;
    try {
      const res = await fetch(`${API}/restaurants/${r.id}/menu`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMenu(m => ({ ...m, [r.id]: data }));
    } catch {
      setMenu(m => ({ ...m, [r.id]: MOCK_MENU[r.id] || [] }));
    }
  }

  function handleAuth(e) {
    e.preventDefault();
    setAuthErr('');
    if (!form.email || !form.password || (authMode === 'signup' && !form.name)) {
      setAuthErr('Please fill all fields');
      return;
    }
    const u = { name: form.name || form.email.split('@')[0], email: form.email };
    fetch(`${API}/auth/${authMode}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    }).catch(() => {});
    setUser(u);
    localStorage.setItem('zater_user', JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('zater_user');
    setCart([]);
    setView('home');
  }

  function addToCart(item) {
    setCart(c => {
      const found = c.find(x => x.id === item.id);
      if (found) return c.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { ...item, qty: 1, restaurant: selected?.name }];
    });
  }

  function changeQty(id, delta) {
    setCart(c => c.map(x => x.id === id ? { ...x, qty: x.qty + delta } : x).filter(x => x.qty > 0));
  }

  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);

  async function placeOrder() {
    const order = { id: Date.now(), items: cart, total, date: new Date().toLocaleString(), status: 'On the way' };
    try {
      await fetch(`${API}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    } catch {}
    setOrders(o => [order, ...o]);
    setCart([]);
    setShowCart(false);
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 3000);
  }

  if (!user) {
    return (
      <div style={styles.authWrap}>
        <form style={styles.card} onSubmit={handleAuth}>
          <h1 style={{ ...styles.logo, color: '#e23744', textAlign: 'center', marginTop: 0 }}>🍴 Zater Eats</h1>
          <p style={{ textAlign: 'center', color: '#666', marginTop: -6 }}>{authMode === 'login' ? 'Welcome back!' : 'Create your account'}</p>
          {authMode === 'signup' && (
            <input style={styles.input} placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          )}
          <input style={styles.input} placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input style={styles.input} placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          {authErr && <p style={{ color: '#e23744', fontSize: 13, margin: '4px 0' }}>{authErr}</p>}
          <button style={styles.btn} type="submit">{authMode === 'login' ? 'Log In' : 'Sign Up'}</button>
          <p style={styles.link} onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthErr(''); }}>
            {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </p>
        </form>
      </div>
    );
  }

  const filtered = restaurants.filter(r =>
    (category === 'All' || r.cat === category) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.logo} onClick={() => setView('home')} title="Home">🍴 Zater Eats</div>
        <div style={styles.navRight}>
          <span style={{ cursor: 'pointer' }} onClick={() => setView('home')}>Home</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setView('orders')}>Orders ({orders.length})</span>
          <button style={styles.cartBtn} onClick={() => setShowCart(true)}>🛒 {cart.reduce((s, x) => s + x.qty, 0)}</button>
          <span style={{ fontSize: 14 }}>Hi, {user.name}</span>
          <button style={{ ...styles.cartBtn, background: 'transparent', color: '#fff', border: '1px solid #fff' }} onClick={logout}>Logout</button>
        </div>
      </header>

      {orderPlaced && (
        <div style={{ background: '#48c479', color: '#fff', padding: 12, textAlign: 'center', fontWeight: 600 }}>
          ✅ Order placed successfully! Your food is on the way.
        </div>
      )}

      {view === 'home' && (
        <>
          <div style={styles.search}>
            <input style={styles.searchInput} placeholder="Search restaurants or cuisines..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ ...styles.search, paddingTop: 0, overflowX: 'auto' }}>
            {CATEGORIES.map(c => (
              <div key={c} style={{ ...styles.chip, ...(category === c ? { background: '#e23744', color: '#fff', borderColor: '#e23744' } : {}) }} onClick={() => setCategory(c)}>{c}</div>
            ))}
          </div>
          <div style={styles.grid}>
            {filtered.map(r => (
              <div key={r.id} style={styles.restCard} onClick={() => openRestaurant(r)}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <img src={r.img} alt={r.name} style={styles.restImg} />
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{r.name}</strong>
                    <span style={styles.badge}>★ {r.rating}</span>
                  </div>
                  <div style={{ color: '#666', fontSize: 14, marginTop: 4 }}>{r.cuisine}</div>
                  <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>⏱ {r.eta} min · ₹{r.price} for two</div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ padding: 24 }}>No restaurants found.</p>}
          </div>
        </>
      )}

      {view === 'menu' && selected && (
        <div style={{ padding: 24 }}>
          <button style={{ ...styles.chip, marginBottom: 16 }} onClick={() => setView('home')}>← Back</button>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
            <img src={selected.img} alt="" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 10 }} />
            <div>
              <h2 style={{ margin: 0 }}>{selected.name}</h2>
              <div style={{ color: '#666' }}>{selected.cuisine} · ★ {selected.rating} · {selected.eta} min</div>
            </div>
          </div>
          <h3>Menu</h3>
          {(menu[selected.id] || []).map(item => (
            <div key={item.id} style={styles.menuItem}>
              <div>
                <strong>{item.name}</strong>
                <div style={{ color: '#666' }}>₹{item.price}</div>
              </div>
              <button style={styles.addBtn} onClick={() => addToCart(item)}>ADD +</button>
            </div>
          ))}
        </div>
      )}

      {view === 'orders' && (
        <div style={{ padding: 24 }}>
          <h2>Your Orders</h2>
          {orders.length === 0 && <p>No orders yet. Start ordering!</p>}
          {orders.map(o => (
            <div key={o.id} style={{ background: '#fff', padding: 16, borderRadius: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Order #{o.id.toString().slice(-5)}</strong>
                <span style={styles.badge}>{o.status}</span>
              </div>
              <div style={{ color: '#888', fontSize: 13 }}>{o.date}</div>
              <ul style={{ margin: '8px 0' }}>
                {o.items.map(i => <li key={i.id}>{i.name} × {i.qty}</li>)}
              </ul>
              <strong>Total: ₹{o.total}</strong>
            </div>
          ))}
        </div>
      )}

      {showCart && (
        <>
          <div style={styles.overlay} onClick={() => setShowCart(false)} />
          <div style={styles.drawer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Your Cart</h2>
              <span style={{ cursor: 'pointer', fontSize: 22 }} onClick={() => setShowCart(false)}>×</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', marginTop: 12 }}>
              {cart.length === 0 && <p style={{ color: '#666' }}>Your cart is empty.</p>}
              {cart.map(item => (
                <div key={item.id} style={styles.cartRow}>
                  <div>
                    <div>{item.name}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>₹{item.price}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button style={styles.qtyBtn} onClick={() => changeQty(item.id, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button style={styles.qtyBtn} onClick={() => changeQty(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#666' }}>
                  <span>Delivery Fee</span><span>₹40</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, margin: '8px 0' }}>
                  <span>Total</span><span>₹{total + 40}</span>
                </div>
                <button style={styles.btn} onClick={placeOrder}>Place Order</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}