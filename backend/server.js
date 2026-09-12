require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const bookingRoutes = require('./routes/booking.routes');
const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/service.routes');
const customerRoutes = require('./routes/customer.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const staffRoutes = require('./routes/staff.routes');
const profileRoutes = require('./routes/profile.routes');
const galleryRoutes = require('./routes/gallery.routes');
const settingsRoutes = require('./routes/settings.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: (origin, cb) => { if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return cb(null, true); if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return cb(null, true); cb(new Error('Not allowed by CORS')); }, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: 'Rate limit' } });
const bookingLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, message: { error: 'Rate limit' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Rate limit' } });

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/bookings', bookingLimiter, bookingRoutes);
app.use('/api/services', generalLimiter, serviceRoutes);
app.use('/api/customer', generalLimiter, customerRoutes);
app.use('/api/dashboard', generalLimiter, dashboardRoutes);
app.use('/api/staff', generalLimiter, staffRoutes);
app.use('/api/profile', generalLimiter, profileRoutes);
app.use('/api/gallery', generalLimiter, galleryRoutes);
app.use('/api/settings', generalLimiter, settingsRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
    console.log('Backend running on port ' + PORT);
});
