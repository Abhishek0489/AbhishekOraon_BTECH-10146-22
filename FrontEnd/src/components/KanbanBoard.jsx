import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard.jsx';

// Mock data for testing
const initialTasks = {
  pending: [
    {
      id: '1',
      title: 'Design user interface',
      description: 'Create wireframes and mockups for the dashboard',
      status: 'pending',
      due_date: '2024-01-20'
    },
    {
      id: '2',
      title: 'Set up database schema',
      description: 'Design and implement the database structure',
      status: 'pending',
      due_date: '2024-01-18'
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all API endpoints and request/response formats',
      status: 'pending',
      due_date: null
    }
  ],
  'in-progress': [
    {
      id: '4',
      title: 'Implement authentication',
      description: 'Set up user authentication and authorization',
      status: 'in-progress',
      due_date: '2024-01-22'
    },
    {
      id: '5',
      title: 'Build task management features',
      description: 'Create CRUD operations for tasks',
      status: 'in-progress',
      due_date: '2024-01-25'
    }
  ],
  completed: [
    {
      id: '6',
      title: 'Project setup',
      description: 'Initialize project structure and install dependencies',
      status: 'completed',
      due_date: '2024-01-15'
    }
  ]
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const columns = [
    { id: 'pending', title: 'Pending', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50 border-green-200' }
  ];

  const onDragEnd = (result) => {
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

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn);
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, task);

      setTasks({
        ...tasks,
        [source.droppableId]: newTasks
      });
    } else {
      // Moving to a different column
      const newSourceTasks = Array.from(sourceColumn);
      newSourceTasks.splice(source.index, 1);

      const newDestTasks = Array.from(destColumn);
      newDestTasks.splice(destination.index, 0, {
        ...task,
        status: destination.droppableId
      });

      setTasks({
        ...tasks,
        [source.droppableId]: newSourceTasks,
        [destination.droppableId]: newDestTasks
      });
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Task Board</h2>
      
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
                    {tasks[column.id]?.map((task, index) => (
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
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
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
