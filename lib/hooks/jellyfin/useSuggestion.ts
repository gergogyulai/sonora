import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getSuggestionsApi } from '@jellyfin/sdk/lib/utils/api';
import { get } from '@jellyfin/sdk/lib/utils/api';
import type { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models';
import { useJellyfinApi, ApiResponse, CACHE_PRESETS, createQueryOptions } from './core';

export function useSuggestion(
    type: BaseItemKind,
    options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  const queryFn = async () => {
    if (!jellyfinApi) throw new Error('Not authenticated');
    
    const { api, userId } = jellyfinApi;
    const suggestionsApi = getSuggestionsApi(api);
    
    return await suggestionsApi.getSuggestions({
      userId,
      type: [type],
      limit: 20,
    });
  };

  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>(
    createQueryOptions(
      ['suggestion', type],
      queryFn,
      CACHE_PRESETS.RECENT,
      { enabled: !!jellyfinApi, ...options }
    )
  );
}
