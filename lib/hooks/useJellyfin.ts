import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { Jellyfin } from '@jellyfin/sdk';
import { Api } from '@jellyfin/sdk/lib/api';
import { getItemsApi, getImageApi, getArtistsApi, getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api';
import React from 'react';

// Initialize the Jellyfin client
const jellyfin = new Jellyfin({
  clientInfo: {
    name: 'Sonora',
    version: '1.0.0'
  },
  deviceInfo: {
    name: 'React Native App',
    id: 'sonora-app-' + Date.now()
  }
});

// Create a reusable Jellyfin API wrapper
const useJellyfinApi = () => {
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

// Type for the API response data
type ApiResponse<T> = { data: T };

// Albums hooks
export function useAlbums<T = unknown>(
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['albums'],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      
      const { api, userId } = jellyfinApi;
      const itemsApi = getItemsApi(api);
      
      return await itemsApi.getItems({
        userId,
        recursive: true,
        includeItemTypes: ['MusicAlbum'],
        sortBy: ['SortName'],
        sortOrder: ['Ascending'],
      });
    },
    enabled: !!jellyfinApi,
    ...options,
  });
}

export function useAlbumById(
  albumId: string, 
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['albums', albumId],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      if (!albumId) throw new Error('Album ID is required');
      
      const { api, userId } = jellyfinApi;
      const userLibraryApi = getUserLibraryApi(api);
      
      return await userLibraryApi.getItem({
        userId,
        itemId: albumId,
      });
    },
    enabled: !!jellyfinApi && !!albumId,
    ...options,
  });
}

// Songs hooks
export function useSongs(
  albumId?: string, 
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: albumId ? ['songs', albumId] : ['songs'],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      
      const { api, userId } = jellyfinApi;
      const itemsApi = getItemsApi(api);
      
      return await itemsApi.getItems({
        userId,
        recursive: true,
        includeItemTypes: ['Audio'],
        parentId: albumId,
        sortBy: ['SortName'],
        sortOrder: ['Ascending'],
      });
    },
    enabled: !!jellyfinApi,
    ...options,
  });
}

// Artists hooks
export function useArtists(
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['artists'],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      
      const { api, userId } = jellyfinApi;
      const artistsApi = getArtistsApi(api);
      
      return await artistsApi.getArtists({
        userId,
      });
    },
    enabled: !!jellyfinApi,
    ...options,
  });
}

export function useArtistById(
  artistId: string, 
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['artists', artistId],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      if (!artistId) throw new Error('Artist ID is required');
      
      const { api, userId } = jellyfinApi;
      const userLibraryApi = getUserLibraryApi(api);
      
      return await userLibraryApi.getItem({
        userId,
        itemId: artistId,
      });
    },
    enabled: !!jellyfinApi && !!artistId,
    ...options,
  });
}

// Get items by artist
export function useItemsByArtist(
  artistId: string,
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['artistItems', artistId],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      if (!artistId) throw new Error('Artist ID is required');
      
      const { api, userId } = jellyfinApi;
      const itemsApi = getItemsApi(api);
      
      return await itemsApi.getItems({
        userId,
        artistIds: [artistId],
        recursive: true,
        includeItemTypes: ['MusicAlbum'],
        sortBy: ['PremiereDate'],
        sortOrder: ['Descending'],
      });
    },
    enabled: !!jellyfinApi && !!artistId,
    ...options,
  });
}

// Recently added items
export function useRecentlyAddedItems(
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['recentlyAdded'],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      
      const { api, userId } = jellyfinApi;
      const itemsApi = getItemsApi(api);
      
      return await itemsApi.getItems({
        userId,
        recursive: true,
        includeItemTypes: ['Audio', 'MusicAlbum'],
        sortBy: ['DateCreated'],
        sortOrder: ['Descending'],
        limit: 20,
      });
    },
    enabled: !!jellyfinApi,
    ...options,
  });
}

// Utility for getting image URLs
export function useImageUrl(itemId: string, imageType: string = 'Primary') {
  const jellyfinApi = useJellyfinApi();
  
  if (!jellyfinApi || !itemId) return null;
  
  const { api } = jellyfinApi;
  const imageApi = getImageApi(api);
  
  // The SDK's type definition might be incorrect, but we know this works
  return imageApi.getItemImageUrl({
    itemId,
    imageType: imageType as any,
  } as any);
}

// All Songs hook
export function useAllSongs(
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['allSongs'],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      
      const { api, userId } = jellyfinApi;
      const itemsApi = getItemsApi(api);
      
      return await itemsApi.getItems({
        userId,
        recursive: true,
        includeItemTypes: ['Audio'],
        sortBy: ['SortName'],
        sortOrder: ['Ascending'],
      });
    },
    enabled: !!jellyfinApi,
    ...options,
  });
}

// Song by ID hook
export function useSongById(
  songId: string, 
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['songs', songId],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      if (!songId) throw new Error('Song ID is required');
      
      const { api, userId } = jellyfinApi;
      const userLibraryApi = getUserLibraryApi(api);
      
      return await userLibraryApi.getItem({
        userId,
        itemId: songId,
      });
    },
    enabled: !!jellyfinApi && !!songId,
    ...options,
  });
}

// Playlists hook
export function usePlaylists(
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['playlists'],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      
      const { api, userId } = jellyfinApi;
      const itemsApi = getItemsApi(api);
      
      return await itemsApi.getItems({
        userId,
        recursive: true,
        includeItemTypes: ['Playlist'],
        sortBy: ['SortName'],
        sortOrder: ['Ascending'],
      });
    },
    enabled: !!jellyfinApi,
    ...options,
  });
}

// Playlist by ID hook
export function usePlaylistById(
  playlistId: string, 
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['playlists', playlistId],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      if (!playlistId) throw new Error('Playlist ID is required');
      
      const { api, userId } = jellyfinApi;
      const userLibraryApi = getUserLibraryApi(api);
      
      return await userLibraryApi.getItem({
        userId,
        itemId: playlistId,
      });
    },
    enabled: !!jellyfinApi && !!playlistId,
    ...options,
  });
}

// Genres hook
export function useGenres(
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['genres'],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      
      const { api, userId } = jellyfinApi;
      const itemsApi = getItemsApi(api);
      
      return await itemsApi.getItems({
        userId,
        recursive: true,
        includeItemTypes: ['MusicGenre'],
        sortBy: ['SortName'],
        sortOrder: ['Ascending'],
      });
    },
    enabled: !!jellyfinApi,
    ...options,
  });
}

// Genre by ID hook
export function useGenreById(
  genreId: string, 
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>({
    queryKey: ['genres', genreId],
    queryFn: async () => {
      if (!jellyfinApi) throw new Error('Not authenticated');
      if (!genreId) throw new Error('Genre ID is required');
      
      const { api, userId } = jellyfinApi;
      const userLibraryApi = getUserLibraryApi(api);
      
      return await userLibraryApi.getItem({
        userId,
        itemId: genreId,
      });
    },
    enabled: !!jellyfinApi && !!genreId,
    ...options,
  });
}

// Audio Streaming hooks

// Get audio streaming URL for a song
export function useAudioStreamUrl(itemId: string) {
  const jellyfinApi = useJellyfinApi();
  
  if (!jellyfinApi || !itemId) return null;
  
  const { api, userId } = jellyfinApi;
  
  // Use the API to create a streaming URL
  // The URL includes the authentication token and userId
  return `${api.basePath}/Audio/${itemId}/universal?audioCodec=aac,mp3,opus,flac,webma&api_key=${api.accessToken}&deviceId=${jellyfin.deviceInfo.id}&userId=${userId}`;
}

// Hook for managing audio playback
export function useAudioPlayback(initialItemId?: string) {
  const jellyfinApi = useJellyfinApi();
  const [currentItemId, setCurrentItemId] = React.useState<string | null>(initialItemId || null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [position, setPosition] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // Get the streaming URL for the current item
  const streamUrl = useAudioStreamUrl(currentItemId || '');
  
  // Initialize the audio element
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      
      // Set up event listeners
      const audio = audioRef.current;
      
      audio.addEventListener('loadstart', () => setLoading(true));
      audio.addEventListener('canplay', () => setLoading(false));
      audio.addEventListener('durationchange', () => setDuration(audio.duration));
      audio.addEventListener('timeupdate', () => setPosition(audio.currentTime));
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setPosition(0);
      });
      
      return () => {
        // Clean up event listeners
        audio.pause();
        audio.src = '';
        audio.removeEventListener('loadstart', () => setLoading(true));
        audio.removeEventListener('canplay', () => setLoading(false));
        audio.removeEventListener('durationchange', () => setDuration(audio.duration));
        audio.removeEventListener('timeupdate', () => setPosition(audio.currentTime));
        audio.removeEventListener('ended', () => {
          setIsPlaying(false);
          setPosition(0);
        });
      };
    }
  }, []);
  
  // Update the audio source when the item changes
  React.useEffect(() => {
    if (audioRef.current && streamUrl) {
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [streamUrl]);
  
  // Control functions
  const play = React.useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);
  
  const pause = React.useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);
  
  const seekTo = React.useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPosition(time);
    }
  }, []);
  
  const playItem = React.useCallback((itemId: string) => {
    setCurrentItemId(itemId);
    setIsPlaying(true);
  }, []);
  
  // Return the playback state and control functions
  return {
    currentItemId,
    isPlaying,
    duration,
    position,
    loading,
    play,
    pause,
    seekTo,
    playItem,
  };
}

// Hook for fetching and preparing a playlist for playback
export function usePlaybackQueue(initialItems: string[] = []) {
  const [queue, setQueue] = React.useState<string[]>(initialItems);
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const playback = useAudioPlayback();
  
  // Initialize the queue
  React.useEffect(() => {
    if (initialItems.length > 0 && currentIndex === -1) {
      setCurrentIndex(0);
      playback.playItem(initialItems[0]);
    }
  }, [initialItems]);
  
  // Control functions
  const next = React.useCallback(() => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      playback.playItem(queue[nextIndex]);
    }
  }, [currentIndex, queue, playback]);
  
  const previous = React.useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      playback.playItem(queue[prevIndex]);
    }
  }, [currentIndex, queue, playback]);
  
  const addToQueue = React.useCallback((itemIds: string[]) => {
    setQueue(prevQueue => [...prevQueue, ...itemIds]);
  }, []);
  
  const clearQueue = React.useCallback(() => {
    setQueue([]);
    setCurrentIndex(-1);
    playback.pause();
  }, [playback]);
  
  const playFromQueue = React.useCallback((index: number) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      playback.playItem(queue[index]);
    }
  }, [queue, playback]);
  
  const replaceQueue = React.useCallback((itemIds: string[], startIndex = 0) => {
    setQueue(itemIds);
    if (itemIds.length > startIndex) {
      setCurrentIndex(startIndex);
      playback.playItem(itemIds[startIndex]);
    }
  }, [playback]);
  
  return {
    ...playback,
    queue,
    currentIndex,
    next,
    previous,
    addToQueue,
    clearQueue,
    playFromQueue,
    replaceQueue,
  };
}

// Report playback progress to Jellyfin server
export function usePlaybackReporting() {
  const jellyfinApi = useJellyfinApi();
  
  const reportProgress = React.useCallback((
    itemId: string, 
    positionTicks: number, 
    isPaused: boolean
  ) => {
    if (!jellyfinApi || !itemId) return;
    
    const { api, userId } = jellyfinApi;
    
    // Report playback progress to the server
    // Note: This is a simplified version, you may need to add more parameters
    fetch(`${api.basePath}/Sessions/Playing/Progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `MediaBrowser Token="${api.accessToken}"`,
      },
      body: JSON.stringify({
        ItemId: itemId,
        UserId: userId,
        PositionTicks: positionTicks * 10000000, // Convert to ticks (1 tick = 100 nanoseconds)
        IsPaused: isPaused,
        EventName: isPaused ? 'pause' : 'timeupdate',
      }),
    }).catch(err => console.error('Error reporting playback progress:', err));
  }, [jellyfinApi]);
  
  return { reportProgress };
}

// Re-export all hooks from the new structure
export * from './jellyfin'; 

