import { getImageApi } from '@jellyfin/sdk/lib/utils/api';
import { useJellyfinApi } from './core';

export function useImageUrl(itemId: string, imageType: string = 'Primary') {
  const jellyfinApi = useJellyfinApi();
  
  if (!jellyfinApi || !itemId) return null;
  
  const { api } = jellyfinApi;
  const imageApi = getImageApi(api);
  
  // The SDK's type definition might be incorrect, but we know this works
  return imageApi.getItemImageUrl({
    itemId,
    imageType: imageType as any,
  } as any);
} 