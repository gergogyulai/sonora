import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api';
import { useJellyfinApi, ApiResponse } from './core';

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