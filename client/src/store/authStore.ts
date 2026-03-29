import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  token: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const initialTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = initialTheme === 'dark' || (!initialTheme && prefersDark);
  
  if (isDark) document.documentElement.classList.add('dark');

  return {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    login: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
    },
    logout: () => {
      localStorage.removeItem('user');
      set({ user: null });
    },
    darkMode: isDark,
    toggleDarkMode: () => set((state) => {
      const newDarkMode = !state.darkMode;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return { darkMode: newDarkMode };
    }),
  };
});
