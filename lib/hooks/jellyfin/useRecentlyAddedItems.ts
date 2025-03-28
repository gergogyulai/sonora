import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api';
import { useJellyfinApi, ApiResponse } from './core';

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