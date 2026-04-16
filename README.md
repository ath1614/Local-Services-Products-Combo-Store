# LocalLink — Hyperlocal Services & Products Platform

**Live:** http://34.100.137.12:8090

A full-stack hyperlocal marketplace where customers can buy products and book services from verified local vendors — all in a single unified cart and checkout.

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Frontend | React, Vite, TypeScript |
| Auth | JWT, bcryptjs |
| Routing | React Router v6 |
| HTTP Client | Axios |

## Project Structure

```
LocalLink/
├── backend/
│   └── src/
│       ├── config/        # DB connection
│       ├── models/        # Mongoose schemas
│       ├── repositories/  # DB access layer
│       ├── services/      # Business logic
│       ├── controllers/   # Route handlers
│       ├── routes/        # Express routers
│       ├── middlewares/   # JWT auth, role guard
│       └── utils/         # JWT helpers
└── frontend/
    └── src/
        ├── api/           # Axios client + API functions
        ├── hooks/         # useAuth, useCart contexts
        ├── pages/         # Landing, Auth, Dashboard, Products, Services, Orders
        ├── components/    # Navbar
        └── styles/        # CSS modules per section
```

## Setup

### Backend
```bash
cd backend
npm install
# create .env from .env.example
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/products | — | List products |
| POST | /api/products | Vendor | Create product |
| PUT | /api/products/:id | Vendor | Update product |
| DELETE | /api/products/:id | Vendor | Remove product |
| GET | /api/services | — | List services |
| POST | /api/services | Provider | Create service |
| POST | /api/orders | Customer | Place order |
| GET | /api/orders | Customer | My orders |
| PATCH | /api/orders/:id/cancel | Customer | Cancel order |
| PATCH | /api/orders/:id/status | Vendor/Provider | Update status |
| POST | /api/reviews | Customer | Submit review |
| GET | /api/search | — | Unified search |
| GET | /api/admin/stats | Admin | Platform stats |

## Roles

- **Customer** — browse, cart, checkout, orders, reviews
- **Vendor** — manage products, fulfill orders
- **Service Provider** — manage services, complete bookings
- **Admin** — user management, platform analytics
