import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wand2, Plus } from 'lucide-react';
import { Task, useTaskStore } from '../store/taskStore';
import api from '../api/axios';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { createTask, updateTask } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  
  // AI Assist feature state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Partial<Task>[]>([]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority || 'Medium');
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.substring(0, 10) : '');
    } else {
      resetForm();
    }
  }, [taskToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
    setAiPrompt('');
    setAiSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, { title, description, priority, dueDate });
      } else {
        await createTask({ title, description, priority, dueDate, status: 'Pending' });
      }
      onClose();
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAiSuggest = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/suggest-tasks', { prompt: aiPrompt });
      setAiSuggestions(data.suggestions);
    } catch (error) {
      console.error('AI Suggestion failed', error);
    } finally {
      setAiLoading(false);
    }
  };

  const acceptSuggestion = (suggestion: Partial<Task>) => {
    setTitle(suggestion.title || '');
    setDescription(suggestion.description || '');
    if (suggestion.priority) setPriority(suggestion.priority as any);
    setAiSuggestions([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"><X className="h-5 w-5" /></button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {!taskToEdit && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <label className="block text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Wand2 className="h-4 w-4" /> AI Task Assistant
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="E.g., Plan my week"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAiSuggest}
                    disabled={aiLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition"
                  >
                    {aiLoading ? 'Thinking...' : 'Generate'}
                  </button>
                </div>
                {aiSuggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {aiSuggestions.map((s, idx) => (
                      <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-sm cursor-pointer hover:border-blue-500 transition"
                        onClick={() => acceptSuggestion(s)}
                      >
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{s.title}</div>
                        <div className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{s.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Task title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Optional descriptions..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
              </div>
            </form>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
            <button type="submit" form="task-form" disabled={loading} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md disabled:opacity-50 flex items-center gap-2">
              {loading ? 'Saving...' : taskToEdit ? 'Update Task' : <><Plus className="h-4 w-4" /> Create Task</>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskForm;
