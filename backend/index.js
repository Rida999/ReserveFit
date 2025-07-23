// backend/index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow your React app (on 5173) to talk to this server
app.use(cors({ origin: 'http://localhost:8083', credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.send('OK'));

// Auth routes
app.use('/auth', authRouter);

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
