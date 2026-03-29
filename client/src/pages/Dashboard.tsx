import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore, Task } from '../store/taskStore';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { TaskSkeleton, DashboardStatsSkeleton } from '../components/SkeletonLoader';
import { Plus, Search, Filter, CheckSquare } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { tasks, loading, stats, fetchTasks } = useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Local state for search/filter to keep it simple
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' ? true : t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's an overview of your tasks.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all scale-100 hover:scale-105 active:scale-95 font-medium"
        >
          <Plus className="h-5 w-5" />
          <span className="inline">New Task</span>
        </button>
      </div>

      {loading && tasks.length === 0 ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass dark:glass-dark rounded-xl p-6 border-l-4 border-l-blue-500">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Tasks</h3>
            <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="glass dark:glass-dark rounded-xl p-6 border-l-4 border-l-green-500">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">Completed</h3>
            <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">{stats.completed}</p>
          </div>
          <div className="glass dark:glass-dark rounded-xl p-6 border-l-4 border-l-yellow-500">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">Pending</h3>
            <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">{stats.pending}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition-shadow relative z-0"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div>
        {loading && tasks.length === 0 ? (
          <>
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </>
        ) : filteredTasks.length > 0 ? (
          <AnimatePresence>
            {filteredTasks.map(task => (
              <TaskCard key={task._id} task={task} onEdit={handleEdit} />
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-16 bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <CheckSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
              {searchQuery ? "Try adjusting your search filters." : "Get started by creating a new task!"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreate}
                className="mt-6 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg font-medium transition"
              >
                Create Task
              </button>
            )}
          </div>
        )}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Dashboard;
