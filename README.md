# 💸 SmartSpend — Expense Tracker

A modern, full-stack expense tracker built with the **MERN stack** (MongoDB, Express, React, Node.js). Features JWT authentication, income/expense management, interactive charts, and a sleek dark dashboard UI.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/Node.js-Express-green) ![Tech Stack](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen) ![Tech Stack](https://img.shields.io/badge/JWT-Auth-orange)

---

## ✨ Features

- **Authentication** — Signup, Login, JWT-based auth, protected routes, logout
- **Expense Management** — Add, edit, delete income & expense entries with categories
- **Dashboard** — Summary cards (income, expense, balance) + monthly bar chart + category pie chart
- **Filters & Sorting** — Filter by type, category, date range; sort by amount or date
- **Responsive UI** — Dark-themed glassmorphism design, mobile-friendly
- **Secure API** — bcrypt password hashing, JWT middleware, input validation

---

## 📁 Project Structure

```
SmartSpend/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Signup, login, getMe
│   │   └── transactionController.js  # CRUD + filters
│   ├── middleware/auth.js        # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema + password hashing
│   │   └── Transaction.js        # Transaction schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── transactionRoutes.js
│   ├── server.js                 # Express entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js          # Axios instance + token interceptor
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── TransactionList.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Transactions.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org)
- **MongoDB** — Local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd SmartSpend
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env     # Edit .env with your MongoDB URI & JWT secret
npm install
npm run dev              # Starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev              # Starts on http://localhost:5173
```

### 4. Open in Browser

Navigate to **http://localhost:5173** — Create an account and start tracking!

---

## 🔑 Environment Variables

Create a `.env` file in `backend/` with:

```env
MONGO_URI=mongodb://localhost:27017/smartspend
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

---

## 📡 API Endpoints

| Method | Endpoint              | Auth | Description              |
| ------ | --------------------- | ---- | ------------------------ |
| POST   | `/api/auth/signup`    | No   | Register a new user      |
| POST   | `/api/auth/login`     | No   | Login & get JWT token    |
| GET    | `/api/auth/me`        | Yes  | Get current user profile |
| GET    | `/api/transactions`   | Yes  | List all transactions    |
| POST   | `/api/transactions`   | Yes  | Create a transaction     |
| PUT    | `/api/transactions/:id` | Yes | Update a transaction   |
| DELETE | `/api/transactions/:id` | Yes | Delete a transaction   |

**Query Params for GET /api/transactions:**
`type`, `category`, `startDate`, `endDate`, `sortBy`, `order`

---

## 🛠 Tech Stack

| Layer     | Technology                                    |
| --------- | --------------------------------------------- |
| Frontend  | React 18, Vite, React Router, Recharts, Axios |
| Backend   | Node.js, Express, Mongoose                    |
| Database  | MongoDB                                       |
| Auth      | JWT, bcryptjs                                 |
| Styling   | Vanilla CSS (dark theme, glassmorphism)        |

---

## 📄 License

MIT — free to use for personal and commercial projects.
