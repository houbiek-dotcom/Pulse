import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/* STREAMING_CHUNK: Initializing Auth Routing... */
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pulse_secret_key_123456';

// Middleware to authenticate JWT
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

export function authRoutes(dbClient) {
  // Signup Endpoint
  router.post('/signup', async (req, res) => {
    const { email, password, name, planTier = 'Free' } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    
    try {
      /* STREAMING_CHUNK: Validating unique user registration... */
      const existing = await dbClient.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email]
      });
      
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      
      const userId = crypto.randomUUID();
      const passwordHash = await bcrypt.hash(password, 10);
      const createdAt = new Date().toISOString();
      
      /* STREAMING_CHUNK: Storing user credentials to team database... */
      await dbClient.execute({
        sql: 'INSERT INTO users (id, email, password_hash, name, plan_tier, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        args: [userId, email, passwordHash, name, planTier, createdAt]
      });
      
      const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: '24h' });
      
      res.status(201).json({
        token,
        user: { id: userId, email, name, planTier }
      });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Internal server error during signup' });
    }
  });

  // Login Endpoint
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    try {
      /* STREAMING_CHUNK: Fetching user and verifying hash... */
      const result = await dbClient.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email]
      });
      
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, planTier: user.plan_tier }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  });

  // Profile retrieval endpoint
  router.get('/me', authenticateToken, async (req, res) => {
    try {
      /* STREAMING_CHUNK: Getting user details from SQLite... */
      const result = await dbClient.execute({
        sql: 'SELECT id, email, name, plan_tier, created_at FROM users WHERE id = ?',
        args: [req.user.id]
      });
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user = result.rows[0];
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        planTier: user.plan_tier,
        createdAt: user.created_at
      });
    } catch (err) {
      console.error('Get Me error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
