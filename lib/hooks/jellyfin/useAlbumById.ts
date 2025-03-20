import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api';
import { useJellyfinApi, ApiResponse } from './core';

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