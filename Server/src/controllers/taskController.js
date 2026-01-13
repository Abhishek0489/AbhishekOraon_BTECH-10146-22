import { getAuthenticatedSupabase } from '../utils/getAuthenticatedSupabase.js';

/**
 * Create a new task
 * POST /api/tasks
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;
    const user_id = req.user.id; // From auth middleware

    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title is required'
      });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Prepare task data
    const taskData = {
      user_id,
      title: title.trim(),
      description: description?.trim() || null,
      status: status || 'pending',
      due_date: due_date || null
    };

    // Create authenticated Supabase client with user's token
    const authenticatedSupabase = getAuthenticatedSupabase(req.accessToken);

    // Insert task into database using authenticated client
    const { data, error } = await authenticatedSupabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to create task',
        details: error.message
      });
    }

    return res.status(201).json({
      message: 'Task created successfully',
      task: data
    });
  } catch (error) {
    console.error('Error in createTask:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while creating the task'
    });
  }
};

/**
 * Get all tasks for the current user
 * GET /api/tasks?status=pending
 */
export const getTasks = async (req, res) => {
  try {
    const user_id = req.user.id; // From auth middleware
    const { status } = req.query;

    // Create authenticated Supabase client with user's token
    const authenticatedSupabase = getAuthenticatedSupabase(req.accessToken);

    // Build query
    let query = authenticatedSupabase
      .from('tasks')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
      query = query.eq('status', status);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to fetch tasks',
        details: error.message
      });
    }

    return res.status(200).json({
      message: 'Tasks fetched successfully',
      count: data?.length || 0,
      tasks: data || []
    });
  } catch (error) {
    console.error('Error in getTasks:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while fetching tasks'
    });
  }
};

/**
 * Update a task by ID
 * PUT /api/tasks/:id
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id; // From auth middleware
    const { title, description, status, due_date } = req.body;

    // Validate task ID
    if (!id) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Task ID is required'
      });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Build update object (only include provided fields)
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status !== undefined) updateData.status = status;
    if (due_date !== undefined) updateData.due_date = due_date || null;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'No fields provided to update'
      });
    }

    // Create authenticated Supabase client with user's token
    const authenticatedSupabase = getAuthenticatedSupabase(req.accessToken);

    // Update task (RLS ensures user can only update their own tasks)
    const { data, error } = await authenticatedSupabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user_id) // Extra safety check
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to update task',
        details: error.message
      });
    }

    // If no data returned, task doesn't exist or doesn't belong to user
    if (!data) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found or you do not have permission to update it'
      });
    }

    return res.status(200).json({
      message: 'Task updated successfully',
      task: data
    });
  } catch (error) {
    console.error('Error in updateTask:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while updating the task'
    });
  }
};

/**
 * Delete a task by ID
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id; // From auth middleware

    // Validate task ID
    if (!id) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Task ID is required'
      });
    }

    // Create authenticated Supabase client with user's token
    const authenticatedSupabase = getAuthenticatedSupabase(req.accessToken);

    // Delete task (RLS ensures user can only delete their own tasks)
    const { data, error } = await authenticatedSupabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id) // Extra safety check
      .select()
      .single();

    if (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to delete task',
        details: error.message
      });
    }

    // If no data returned, task doesn't exist or doesn't belong to user
    if (!data) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found or you do not have permission to delete it'
      });
    }

    return res.status(200).json({
      message: 'Task deleted successfully',
      task: data
    });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while deleting the task'
    });
  }
};
