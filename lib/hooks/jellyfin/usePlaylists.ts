import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api';
import { useJellyfinApi, ApiResponse, CACHE_PRESETS, createQueryOptions } from './core';

export function usePlaylists<T = unknown>(
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  const queryFn = async () => {
    if (!jellyfinApi) throw new Error('Not authenticated');
    
    const { api, userId } = jellyfinApi;
    const itemsApi = getItemsApi(api);
    
    return await itemsApi.getItems({
      userId,
      includeItemTypes: ['Playlist'],
      sortBy: ['SortName'],
      sortOrder: ['Ascending'],
    });
  };

  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>(
    createQueryOptions(
      ['playlists'],
      queryFn,
      CACHE_PRESETS.PLAYLISTS,
      { enabled: !!jellyfinApi, ...options }
    )
  );
} 