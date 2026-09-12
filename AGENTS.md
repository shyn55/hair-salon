# AGENTS.md

## Project Structure

- **Service layer** (`backend/services/`) sits between controllers and Prisma. Controllers are thin adapters — they parse requests and delegate to services. Never call `prisma.*` directly from controllers.
- **Service IDs are strings** like `"svc-1"`, not integers. The Prisma schema uses `@id @default(cuid())`.
- **Two separate app shells**: Admin (`frontend/src/admin/AdminApp.jsx`) and public (`frontend/src/App.jsx`) share no components, theme, or auth context. Admin uses Inter font + indigo accents; public uses Vazir + gold. Unifying them is an open task.

## API Routes

- Customer-facing routes are under `/api/customer/` (e.g., `/api/customer/availability`), NOT `/api/availability`. Easy to get wrong.
- Booking creation is `POST /api/bookings/create`, not `POST /api/bookings`.
- All admin endpoints require `Authorization: Bearer <token>` header.

## Environment & Running

- **Backend PORT**: The `.env` has `PORT=5000` but the shell environment may override it to `0`. Always start with `PORT=5000 node backend/server.js` or the server binds to port 0.
- **CORS**: Accepts both `localhost` and `127.0.0.1`. The Vite preview binds to `127.0.0.1` which caused CORS errors before the fix.
- **Font CDN**: Vazir is loaded from `cdn.fontcdn.ir`. Uses `media="print" onload` pattern to avoid render-blocking. If the CDN is slow, the app falls back to system sans-serif.

## Known Quirks

- **Postgres date handling**: `parseLocalDate("2026-09-16")` uses `Date.UTC()` to store midnight UTC, so the exact day persists. All date accessors use `getUTCDay()` etc. The old SQLite local-time bug is resolved.
- **React style conflict**: `BottomNav.jsx` had `backgroundColor` + `background: 'none'` on the same element — the shorthand overrode the longhand, causing a React warning on every render. Always use longhand only.
- **`booking.controller.js` lazy require**: `ServiceService` is required inside `fetchAvailableTimes` function body, not at module top. Works due to Node.js module caching but is unusual.
- **Playwright geo-block**: `playwright install chromium` fails in Iran with "Access denied" from the CDN. Use `channel="chrome"` to leverage the system Chrome installation instead.

## Testing

- **E2E test command**: `python3.14t.exe tests/test_e2e.py` (uses system Python 3.14 at `C:\Users\FourTeam\AppData\Local\Programs\Python\Python314\python3.14t.exe`).
- **Module smoke test**: `node -e "require('./backend/services/BookingService'); ..."` — loads all services + controllers to verify no import errors.
- **Backend must be running on port 5000** for E2E tests. Frontend dev server on port 5173.
- **Console errors to ignore in tests**: `ERR_CONNECTION_CLOSED`, `ERR_TIMED_OUT`, `404` from font CDN — these are network-level, not app bugs.

## Architecture Decisions

- **Service layer as test surface**: Services are unit-testable with a mock Prisma client. No HTTP or JWT needed. This was the primary motivation for the refactoring.
- **Code splitting via React.lazy**: BookingScreen, Gallery, Services, About are lazy-loaded. Only the 84KB initial bundle ships on load. Each chunk is 1-6KB.
- **Conflict detection is single-source**: `BookingService.findConflict()` runs inside `$transaction`. Concurrent bookings for the same slot serialize correctly — exactly one succeeds.
- **No data caching on frontend**: Every screen re-fetches on mount. Adding React Query would eliminate ~15 redundant API calls per session. This is the highest-impact remaining improvement.
