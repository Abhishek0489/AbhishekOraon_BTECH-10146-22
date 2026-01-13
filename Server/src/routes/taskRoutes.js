import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

/**
 * Task Routes
 * All routes are protected by authMiddleware (applied in server.js)
 * 
 * GET    /api/tasks          - Get all tasks for current user (optional ?status= query param)
 * POST   /api/tasks          - Create a new task
 * PUT    /api/tasks/:id      - Update a task by ID
 * DELETE /api/tasks/:id      - Delete a task by ID
 */

// GET /api/tasks - Get all tasks (with optional status filter)
router.get('/', getTasks);

// POST /api/tasks - Create a new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update a task by ID
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete a task by ID
router.delete('/:id', deleteTask);

export default router;
