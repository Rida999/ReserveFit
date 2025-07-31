// backend/index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRouter      = require('./routes/auth');
const apiRouter       = require('./routes/api');
const adminRouter     = require('./routes/admin');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// CORS: allow your React app origin + Authorization header
app.use(cors({
  origin: 'http://localhost:8083',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Public auth endpoints
app.use('/auth', authRouter);

// Secure all API & admin endpoints
app.use('/api', authenticateToken, apiRouter);
app.use('/admin', authenticateToken, adminRouter);

// Health check
app.get('/health', (_req, res) => res.send('OK'));

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
