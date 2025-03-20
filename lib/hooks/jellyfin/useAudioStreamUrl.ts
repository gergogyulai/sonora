import { useAuth } from '@/context/AuthContext';
import { useJellyfinApi } from './core';
import { jellyfin } from './core';

export function useAudioStreamUrl(itemId: string) {
  const jellyfinApi = useJellyfinApi();
  const { token } = useAuth();
  
  if (!jellyfinApi || !itemId) return null;
  
  const { api, userId } = jellyfinApi;

  console.log('userId', userId);
  
  // Use the API to create a streaming URL with multiple audio codec options
  return `${api.basePath}/Audio/${itemId}/universal?audioCodec=aac,mp3,opus,flac&api_key=${token}&deviceId=${jellyfin.deviceInfo.id}&userId=${userId}`;
} 