import { create } from 'zustand';
import api from '../api/axios';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  stats: { total: number; completed: number; pending: number };
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  stats: { total: 0, completed: 0, pending: 0 },
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/tasks');
      const tasks = data.tasks;
      const completed = tasks.filter((t: Task) => t.status === 'Completed').length;
      set({ 
        tasks, 
        stats: { total: tasks.length, completed, pending: tasks.length - completed },
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching tasks', error);
      set({ loading: false });
    }
  },
  createTask: async (task) => {
    try {
      await api.post('/tasks', task);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error creating task', error);
      throw error;
    }
  },
  updateTask: async (id, updatedFields) => {
    try {
      await api.put(`/tasks/${id}`, updatedFields);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error updating task', error);
      throw error;
    }
  },
  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error deleting task', error);
      throw error;
    }
  }
}));
