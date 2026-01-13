import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard.jsx';
import api from '../services/api.js';

// Helper function to organize tasks by status
const organizeTasksByStatus = (tasks) => {
  const organized = {
    pending: [],
    'in-progress': [],
    completed: []
  };

  tasks.forEach((task) => {
    if (organized[task.status]) {
      organized[task.status].push(task);
    }
  });

  return organized;
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    pending: [],
    'in-progress': [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const columns = [
    { id: 'pending', title: 'Pending', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50 border-green-200' }
  ];

  // Fetch tasks from API when component mounts or filter changes
  useEffect(() => {
    fetchTasks(statusFilter);
  }, [statusFilter]);

  // Listen for storage events to refresh when tasks are created elsewhere
  useEffect(() => {
    const handleStorageChange = () => {
      fetchTasks(statusFilter);
    };
    
    window.addEventListener('taskCreated', handleStorageChange);
    return () => window.removeEventListener('taskCreated', handleStorageChange);
  }, [statusFilter]);

  const fetchTasks = async (status = 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      // Build API URL with status query parameter if not 'all'
      let url = '/tasks';
      if (status && status !== 'all') {
        url += `?status=${status}`;
      }
      
      const response = await api.get(url);
      const tasksArray = response.data.tasks || [];
      const organizedTasks = organizeTasksByStatus(tasksArray);
      setTasks(organizedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setStatusFilter(newFilter);
    // fetchTasks will be called automatically via useEffect
  };

  const handleDeleteTask = async (taskId) => {
    // Find the task and its column
    let taskToDelete = null;
    let columnId = null;
    
    for (const [colId, taskList] of Object.entries(tasks)) {
      const task = taskList.find(t => t.id === taskId);
      if (task) {
        taskToDelete = task;
        columnId = colId;
        break;
      }
    }

    if (!taskToDelete || !columnId) {
      console.error('Task not found');
      return;
    }

    // Store original state for potential revert
    const originalTasks = JSON.parse(JSON.stringify(tasks));

    // Optimistically remove task from UI
    const updatedTasks = {
      ...tasks,
      [columnId]: tasks[columnId].filter(t => t.id !== taskId)
    };
    setTasks(updatedTasks);

    // Call API to delete task
    try {
      await api.delete(`/tasks/${taskId}`);
      // Success - state is already updated optimistically
    } catch (err) {
      console.error('Error deleting task:', err);
      // Revert to original state on error
      setTasks(originalTasks);
      setError('Failed to delete task. Please try again.');
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];
    const task = sourceColumn.find((t) => t.id === draggableId);

    if (!task) {
      return;
    }

    // Store original state for potential revert
    const originalTasks = JSON.parse(JSON.stringify(tasks));

    // Optimistically update the UI
    let newTasks;
    if (source.droppableId === destination.droppableId) {
      // Moving within the same column (reordering)
      const newColumnTasks = Array.from(sourceColumn);
      newColumnTasks.splice(source.index, 1);
      newColumnTasks.splice(destination.index, 0, task);

      newTasks = {
        ...tasks,
        [source.droppableId]: newColumnTasks
      };
    } else {
      // Moving to a different column (status change)
      const newSourceTasks = Array.from(sourceColumn);
      newSourceTasks.splice(source.index, 1);

      const newDestTasks = Array.from(destColumn);
      newDestTasks.splice(destination.index, 0, {
        ...task,
        status: destination.droppableId
      });

      newTasks = {
        ...tasks,
        [source.droppableId]: newSourceTasks,
        [destination.droppableId]: newDestTasks
      };
    }

    // Optimistically update UI
    setTasks(newTasks);

    // Only call API if status changed (different column)
    if (source.droppableId !== destination.droppableId) {
      try {
        await api.put(`/tasks/${task.id}`, {
          status: destination.droppableId
        });
        // Success - state is already updated optimistically
      } catch (err) {
        console.error('Error updating task status:', err);
        // Revert to original state on error
        setTasks(originalTasks);
        setError('Failed to update task status. Please try again.');
        // Clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Loading tasks...</div>
        </div>
      </div>
    );
  }

  if (error && tasks.pending.length === 0 && tasks['in-progress'].length === 0 && tasks.completed.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => fetchTasks(statusFilter)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`rounded-lg border-2 ${column.color} p-4 min-h-[400px]`}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {column.title}
                </h3>
                <span className="text-sm text-gray-600">
                  {tasks[column.id]?.length || 0} tasks
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[300px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-opacity-50' : ''
                    }`}
                  >
                    {tasks[column.id]?.length > 0 ? (
                      tasks[column.id].map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${
                                snapshot.isDragging
                                  ? 'opacity-50 rotate-2'
                                  : ''
                              }`}
                            >
                              <TaskCard task={task} onDelete={handleDeleteTask} />
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 text-sm py-8">
                        No tasks
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
