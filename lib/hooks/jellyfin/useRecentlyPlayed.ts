import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getItemsApi, getUserApi, getSuggestionsApi, getAudioApi } from '@jellyfin/sdk/lib/utils/api';
import { useJellyfinApi, ApiResponse, CACHE_PRESETS, createQueryOptions } from './core';

export function useRecentlyPlayed(
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error, ApiResponse<any>>, 'queryKey' | 'queryFn'>
) {
  const jellyfinApi = useJellyfinApi();
  
  const queryFn = async () => {
    if (!jellyfinApi) throw new Error('Not authenticated');
    
    const { api, userId } = jellyfinApi;
    const itemsApi = getItemsApi(api);
    const suggestionsApi = getSuggestionsApi(api);
    
    return await suggestionsApi.getSuggestions({
      userId,
      type: ["MusicAlbum"],
      limit: 20,
    });
  };

  return useQuery<ApiResponse<any>, Error, ApiResponse<any>>(
    createQueryOptions(
      ['recentlyPlayed'],
      queryFn,
      CACHE_PRESETS.RECENT,
      { enabled: !!jellyfinApi, ...options }
    )
  );
}
