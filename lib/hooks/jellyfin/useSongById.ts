import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api';
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client';
import { useJellyfinApi, ApiResponse } from './core';

export function useSongById(
  songId: string, 
  options?: Omit<UseQueryOptions<ApiResponse<BaseItemDto>, Error, ApiResponse<BaseItemDto>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  return useQuery<ApiResponse<BaseItemDto>, Error, ApiResponse<BaseItemDto>>({
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