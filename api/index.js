/**
 * Vercel serverless entry point for Pulse.
 * Imports the configured Express app and exports it as a serverless function.
 * Vercel automatically handles invocation — no app.listen() needed.
 */
import { createApp } from '../backend/server.js';

const { app, setupDatabase } = createApp();

// Initialize database tables eagerly on cold start
setupDatabase()
  .then(() => console.log('[Vercel] Database setup completed on cold start'))
  .catch((err) => console.error('[Vercel] Database setup failed:', err));

// Export the Express app as the default serverless handler
export default app;