// backend/server.js
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import './config/passport.js'; 
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: 'lms-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: '✅ API Connected', time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});
app.get('/', (req, res) => {
  res.send('✅ API is working');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
