# Luxury Hair Studio

Premium Hair Studio Booking System — A full-stack web application for managing salon bookings, services, gallery, and admin dashboard.

## Tech Stack

- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL
- **Frontend:** React 18, Vite, GSAP (animations), Lucide React (icons)
- **Admin:** Separate React app shell with Inter font + indigo accents

## Project Structure

```
├── backend/
│   ├── controllers/      # Thin request adapters
│   ├── services/         # Business logic layer
│   ├── routes/           # Express route definitions
│   ├── middleware/        # Auth, error handling
│   ├── utils/            # SlotEngine, Prisma client
│   ├── prisma/           # Schema, seed data
│   └── server.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── screens/      # Public pages (Home, Booking, Gallery, etc.)
│   │   ├── components/   # Shared components (BookingForm, BottomNav, etc.)
│   │   ├── admin/        # Admin dashboard (separate app shell)
│   │   └── App.jsx       # Public app shell
│   └── vite.config.js
├── tests/
│   └── test_e2e.py       # End-to-end tests
└── AGENTS.md             # Architecture decisions and conventions
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Python 3.14+ (for E2E tests only)

### Backend

```bash
cd backend
cp .env.example .env     # Edit with your database credentials
npm install
npx prisma db push       # Create database schema
npm run db:seed          # Populate with sample data
npm run dev              # Start on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev              # Start on port 5173
```

### E2E Tests

```bash
# Backend must be running on port 5000
python3 tests/test_e2e.py
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `PORT` | Backend server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | — |
| `JWT_SECRET` | Secret for admin auth tokens | — |

## Key Features

- **Booking System:** Multi-step booking flow with real-time availability
- **Conflict Detection:** Atomic slot booking via Prisma transactions
- **Admin Dashboard:** Manage services, bookings, gallery, staff, settings
- **Responsive Design:** Mobile-first with RTL support (Vazir font)
- **Code Splitting:** Lazy-loaded routes for fast initial load

## API Routes

- Customer-facing: `/api/customer/*`
- Booking creation: `POST /api/bookings/create`
- Admin endpoints: Require `Authorization: Bearer <token>`

## Performance

- Initial bundle: ~85KB gzipped
- Code-split chunks: 1-6KB each
- No data caching on frontend (React Query recommended as next improvement)

## License

Private — All rights reserved.
