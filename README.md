# Zater Eats 🍔

A full-stack food delivery application (similar to Zomato/Swiggy) where users can browse restaurants, explore menus, place orders, and track deliveries.

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v14 or higher)
- **Git**

---

## 🚀 Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/zater-eats.git
cd zater-eats
```

The project has two main folders:

```
zater-eats/
├── backend/     # Node.js + Express API server
└── frontend/    # React client app
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install express pg dotenv cors bcryptjs jsonwebtoken multer stripe
npm install --save-dev nodemon
```

| Package | Purpose |
|---------|---------|
| `express` | Web server framework |
| `pg` | PostgreSQL client |
| `dotenv` | Load environment variables |
| `cors` | Enable cross-origin requests |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | User authentication (JWT) |
| `multer` | Restaurant/food image uploads |
| `stripe` | Payment processing |
| `nodemon` | Auto-restart server in dev (dev only) |

---

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install react react-dom react-router-dom axios
npm install react-icons react-hot-toast
npm install --save-dev vite @vitejs/plugin-react
```

| Package | Purpose |
|---------|---------|
| `react` / `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `axios` | API requests |
| `react-icons` | Icons for UI |
| `react-hot-toast` | Toast notifications |
| `vite` / `@vitejs/plugin-react` | Build tool & dev server |

---

### 4. Configure Environment Variables

#### Backend — create `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/zater_eats
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=zater_eats

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

#### Frontend — create `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

---

### 5. Create the Database

Open your PostgreSQL shell and create the database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE zater_eats;
\q
```

---

### 6. Run the SQL Schema

Load the provided schema file into your database:

```bash
psql -U postgres -d zater_eats -f backend/schema.sql
```

This creates the core tables: `users`, `restaurants`, `menu_items`, `orders`, `order_items`, and `deliveries`.

> 💡 To verify the tables were created, run `psql -U postgres -d zater_eats -c "\dt"`.

---

### 7. Start the Backend Server

```bash
cd backend
npm run dev
```

The API will run at: **http://localhost:5000**

> If `npm run dev` is not configured, add this to `backend/package.json`:
> ```json
> "scripts": { "dev": "nodemon server.js", "start": "node server.js" }
> ```

---

### 8. Start the Frontend Server

Open a **new terminal**:

```bash
cd frontend
npm run dev
```

The client will run at: **http://localhost:5173**

---

### 9. Open in Browser

Visit:

```
http://localhost:5173
```

You should see the **Zater Eats** homepage. 🎉

---

## ✅ Quick Start Summary

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 🛠️ Troubleshooting

- **Database connection error** → Verify PostgreSQL is running and `DATABASE_URL` credentials in `backend/.env` are correct.
- **CORS errors** → Ensure `CLIENT_URL` in the backend matches your frontend URL.
- **Port already in use** → Change `PORT` in `backend/.env` or stop the conflicting process.
- **API calls failing** → Confirm `VITE_API_URL` in `frontend/.env` points to the running backend.

---

## 📄 License

MIT License — feel free to use and modify.