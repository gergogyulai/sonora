import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api';
import { useJellyfinApi, ApiResponse } from './core';

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