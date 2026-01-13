import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './src/routes/taskRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import { authMiddleware } from './src/middleware/authMiddleware.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Task Management System API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Task routes - protected by authMiddleware
app.use('/api/tasks', authMiddleware, taskRoutes);

// User routes - protected by authMiddleware
app.use('/api/user', authMiddleware, userRoutes);

// Get port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
