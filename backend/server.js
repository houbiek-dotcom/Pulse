import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';
import { authRoutes } from './routes/auth.js';
import { billingRoutes } from './routes/billing.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Initialize Turso/team-db libsql client
const dbClient = createClient({
  url: process.env.TEAM_DB_URL || 'file:local.db',
  authToken: process.env.TEAM_DB_AUTH_TOKEN,
});

app.use('/api/auth', authRoutes(dbClient));
app.use('/api/billing', billingRoutes(dbClient));

/**
 * Setup SQLite/Turso tables for Pulse if they do not exist.
 * Conforms exactly to the Team Lead's specifications.
 */
async function setupDatabase() {
  console.log('Pulse DB Setup: Initializing tables based on Lead guidelines...');
  try {
    // 1. Create users table
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        plan_tier TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
    
    // 2. Create stores table
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS stores (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        platform_type TEXT NOT NULL,
        api_key TEXT,
        store_name TEXT NOT NULL,
        connected_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // 3. Create orders table
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        amount REAL NOT NULL,
        platform TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (store_id) REFERENCES stores(id)
      );
    `);

    console.log('Pulse DB Setup: All tables initialized successfully.');
    return { success: true, message: 'Database tables successfully set up.' };
  } catch (err) {
    console.error('Pulse DB Setup Error:', err);
    throw err;
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/metrics', (req, res) => {
  res.json({
    mrr: 12500,
    mrr_growth: 12.5,
    conversion_rate: 18.2,
    active_trials: 45,
    churn_rate: 3.8,
  });
});

// Setup API Endpoint (Lead specified path /api/setup-db)
app.get('/api/setup-db', async (req, res) => {
  try {
    const result = await setupDatabase();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to set up database schema', details: err.message });
  }
});

// Serve built frontend static files
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback to frontend index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Execute setupDatabase automatically on startup, then listen
setupDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Pulse API Backend is listening publicly on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Pulse server failed to start due to database setup failure:', err);
    process.exit(1);
  });
