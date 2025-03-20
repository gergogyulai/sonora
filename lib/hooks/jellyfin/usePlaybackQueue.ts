import React from 'react';
import { useAudioPlayback } from './useAudioPlayback';

export function usePlaybackQueue(initialItems: string[] = []) {
  const [queue, setQueue] = React.useState<string[]>(initialItems);
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const playback = useAudioPlayback();
  
  // Initialize the queue
  React.useEffect(() => {
    if (initialItems.length > 0 && currentIndex === -1) {
      setCurrentIndex(0);
      playback.playItem(initialItems[0]);
    }
  }, [initialItems]);
  
  // Control functions
  const next = React.useCallback(() => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      playback.playItem(queue[nextIndex]);
    }
  }, [currentIndex, queue, playback]);
  
  const previous = React.useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      playback.playItem(queue[prevIndex]);
    }
  }, [currentIndex, queue, playback]);
  
  const addToQueue = React.useCallback((itemIds: string[]) => {
    setQueue(prevQueue => [...prevQueue, ...itemIds]);
  }, []);
  
  const clearQueue = React.useCallback(() => {
    setQueue([]);
    setCurrentIndex(-1);
    playback.pause();
  }, [playback]);
  
  const playFromQueue = React.useCallback((index: number) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      playback.playItem(queue[index]);
    }
  }, [queue, playback]);
  
  const replaceQueue = React.useCallback((itemIds: string[], startIndex = 0) => {
    setQueue(itemIds);
    if (itemIds.length > startIndex) {
      setCurrentIndex(startIndex);
      playback.playItem(itemIds[startIndex]);
    }
  }, [playback]);
  
  return {
    ...playback,
    queue,
    currentIndex,
    next,
    previous,
    addToQueue,
    clearQueue,
    playFromQueue,
    replaceQueue,
  };
} 