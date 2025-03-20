import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getArtistsApi } from '@jellyfin/sdk/lib/utils/api';
import { useJellyfinApi, ApiResponse } from './core';

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