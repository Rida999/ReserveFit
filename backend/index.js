// backend/index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  // Get a real user id from your users table:
  req.user = { id: '3472bcf6-9eb1-4cf0-965a-1108cdee6340' };
  next();
});

// Allow your React app (on 5173) to talk to this server
app.use(cors({ origin: 'http://localhost:8083', credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.send('OK'));

// Auth routes
app.use('/auth', authRouter);

app.use('/api', require('./routes/api'));

// 404 handler
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
