import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the store state type
interface AppState {
  // User state
  user: {
    isLoggedIn: boolean;
    userId?: string;
    username?: string;
  };
  // Actions
  login: (userId: string, username: string) => void;
  logout: () => void;
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: {
        isLoggedIn: false,
      },
      
      // Actions
      login: (userId: string, username: string) => set((state) => ({
        user: {
          ...state.user,
          isLoggedIn: true,
          userId,
          username,
        }
      })),
      
      logout: () => set((state) => ({
        user: {
          ...state.user,
          isLoggedIn: false,
          userId: undefined,
          username: undefined,
        }
      })),
    }),
    {
      name: 'sonora-app-storage', // Name for storage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
); 