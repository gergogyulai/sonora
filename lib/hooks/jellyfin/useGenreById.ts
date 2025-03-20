import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api';
import { useJellyfinApi, ApiResponse } from './core';

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