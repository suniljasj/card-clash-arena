import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      error: null,

      login: async (username: string, password: string) => {
        try {
          set({ error: null });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            username,
            email: `${username}@example.com`,
            createdAt: new Date()
          };
          
          set({ user, isAuthenticated: true });
          return true;
        } catch (error) {
          set({ error: "Login failed. Please try again." });
          return false;
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          set({ error: null });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful registration
          const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            username,
            email,
            createdAt: new Date()
          };
          
          set({ user, isAuthenticated: true });
          return true;
        } catch (error) {
          set({ error: "Registration failed. Please try again." });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      setError: (error: string | null) => {
        set({ error });
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);
