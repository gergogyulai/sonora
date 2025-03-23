import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api';
import { BaseItemDto, BaseItemDtoQueryResult } from '@jellyfin/sdk/lib/generated-client';
import { useJellyfinApi, ApiResponse, CACHE_PRESETS, createQueryOptions } from './core';

export function useAllSongs(
  options?: Omit<UseQueryOptions<ApiResponse<BaseItemDtoQueryResult>, Error, ApiResponse<BaseItemDtoQueryResult>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  const queryFn = async () => {
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
  };

  return useQuery<ApiResponse<BaseItemDtoQueryResult>, Error, ApiResponse<BaseItemDtoQueryResult>>(
    createQueryOptions(
      ['songs', 'all'],
      queryFn,
      CACHE_PRESETS.SONGS,
      { enabled: !!jellyfinApi, ...options }
    )
  );
} 