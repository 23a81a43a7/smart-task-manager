import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2, CheckCircle, Circle, Edit3 } from 'lucide-react';
import { Task, useTaskStore } from '../store/taskStore';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTaskStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleStatus = async () => {
    setIsUpdating(true);
    await updateTask(task._id, { status: task.status === 'Completed' ? 'Pending' : 'Completed' });
    setIsUpdating(false);
  };

  const priorityColors = {
    Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  const isCompleted = task.status === 'Completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`glass dark:glass-dark rounded-xl p-5 mb-4 group transition-all duration-300 ${isCompleted ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={toggleStatus}
          disabled={isUpdating}
          className={`mt-1 flex-shrink-0 transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-400 hover:text-blue-500'}`}
        >
          {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold truncate ${isCompleted ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-2 text-sm line-clamp-2 ${isCompleted ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority || 'Medium'}
            </span>
            {task.dueDate && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-500 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            className="p-2 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
