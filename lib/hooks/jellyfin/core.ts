import { useAuth } from '../../../context/AuthContext';
import { Jellyfin } from '@jellyfin/sdk';
import { Api } from '@jellyfin/sdk/lib/api';

// Initialize the Jellyfin client
export const jellyfin = new Jellyfin({
  clientInfo: {
    name: 'Sonora',
    version: '1.0.0'
  },
  deviceInfo: {
    name: 'React Native App',
    id: 'sonora-app-' + Date.now()
  }
});

// Type for the API response data
export type ApiResponse<T> = { data: T };

// Create a reusable Jellyfin API wrapper
export const useJellyfinApi = () => {
  const { token, serverUrl, userId } = useAuth();

  if (!token || !serverUrl || !userId) {
    return null;
  }

  // Get the API instance
  const api = jellyfin.createApi(serverUrl);
  
  // Set authentication info
  api.accessToken = token;
  
  return {
    api,
    userId
  };
}; 