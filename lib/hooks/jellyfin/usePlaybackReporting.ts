import React from 'react';
import { useJellyfinApi } from './core';

export function usePlaybackReporting() {
  const jellyfinApi = useJellyfinApi();
  
  const reportProgress = React.useCallback((
    itemId: string, 
    positionTicks: number, 
    isPaused: boolean
  ) => {
    if (!jellyfinApi || !itemId) return;
    
    const { api, userId } = jellyfinApi;
    
    // Report playback progress to the server
    // Note: This is a simplified version, you may need to add more parameters
    fetch(`${api.basePath}/Sessions/Playing/Progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `MediaBrowser Token="${api.accessToken}"`,
      },
      body: JSON.stringify({
        ItemId: itemId,
        UserId: userId,
        PositionTicks: positionTicks * 10000000, // Convert to ticks (1 tick = 100 nanoseconds)
        IsPaused: isPaused,
        EventName: isPaused ? 'pause' : 'timeupdate',
      }),
    }).catch(err => console.error('Error reporting playback progress:', err));
  }, [jellyfinApi]);
  
  return { reportProgress };
} 