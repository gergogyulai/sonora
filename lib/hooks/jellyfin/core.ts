import { useAuth } from '../../../context/AuthContext';
import { Jellyfin } from '@jellyfin/sdk';
import { Api } from '@jellyfin/sdk/lib/api';
import { UseQueryOptions } from '@tanstack/react-query';

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

// Cache configuration presets for different content types
export const CACHE_PRESETS = {
  // Albums change less frequently
  ALBUMS: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },
  // Songs change less frequently
  SONGS: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },
  // Playlists might change more often
  PLAYLISTS: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  },
  // Recently added items change frequently
  RECENT: {
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  }
};

// Create query options with custom caching settings
export function createQueryOptions<TData, TError, TResult>(
  queryKey: string[],
  queryFn: () => Promise<TResult>,
  cachePreset = CACHE_PRESETS.SONGS,
  customOptions?: Partial<UseQueryOptions<TResult, TError, TData>>
): UseQueryOptions<TResult, TError, TData> {
  return {
    queryKey,
    queryFn,
    staleTime: cachePreset.staleTime,
    gcTime: cachePreset.gcTime,
    ...customOptions,
  };
}

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