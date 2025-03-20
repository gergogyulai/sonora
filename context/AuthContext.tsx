import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of our auth state
type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  serverUrl: string;
  username: string;
  token: string;
  userId: string;
};

// Define the context value shape
type AuthContextValue = AuthState & {
  login: (serverUrl: string, username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isFirstLaunch: boolean | null;
  setFirstLaunchComplete: () => Promise<void>;
  resetLogoutState: () => void;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Auth provider props
type AuthProviderProps = {
  children: React.ReactNode;
};

// Storage keys
const AUTH_STORAGE_KEY = 'sonora_auth_data';
const FIRST_LAUNCH_KEY = 'sonora_first_launch_completed';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Auth state
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    serverUrl: '',
    username: '',
    token: '',
    userId: '',
  });
  
  // First launch state
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  // Load auth state from storage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          setAuthState({
            ...parsedAuth,
            isLoading: false,
          });
        } else {
          setAuthState(prevState => ({ ...prevState, isLoading: false }));
        }

        // Check if it's the first launch
        const firstLaunchValue = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
        setIsFirstLaunch(firstLaunchValue === null);
      } catch (error) {
        console.error('Failed to load auth state:', error);
        setAuthState(prevState => ({ ...prevState, isLoading: false }));
      }
    };

    loadAuthState();
  }, []);

  // Set first launch as completed
  const setFirstLaunchComplete = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'completed');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Failed to save first launch state:', error);
    }
  };
  
  // Reset logout state - keeping this for API compatibility
  const resetLogoutState = async () => {
    // This function is now a no-op since we simplified the flow
    return;
  };

  // Login function for Jellyfin
  const login = async (serverUrl: string, username: string, password: string): Promise<boolean> => {
    try {
      // Remove trailing slash if present
      const normalizedUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
      
      // Get device info for authentication
      const deviceId = 'sonora-app-' + Math.random().toString(36).substring(2, 15);
      const deviceName = 'Sonora Music App';
      
      // Authenticate with Jellyfin
      const response = await fetch(`${normalizedUrl}/Users/AuthenticateByName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Emby-Authorization': `MediaBrowser Client="Sonora", Device="${deviceName}", DeviceId="${deviceId}", Version="1.0.0"`,
        },
        body: JSON.stringify({
          Username: username,
          Pw: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const authResult = await response.json();
      
      // Update auth state
      const newAuthState = {
        isAuthenticated: true,
        isLoading: false,
        serverUrl: normalizedUrl,
        username,
        token: authResult.AccessToken,
        userId: authResult.User.Id,
      };

      // Save to state and storage
      setAuthState(newAuthState);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Clear auth data from storage
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      
      // Update state
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        serverUrl: '',
        username: '',
        token: '',
        userId: '',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Context value
  const value: AuthContextValue = {
    ...authState,
    login,
    logout,
    isFirstLaunch,
    setFirstLaunchComplete,
    resetLogoutState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 