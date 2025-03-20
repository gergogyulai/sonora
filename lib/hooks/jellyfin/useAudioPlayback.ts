import React from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useJellyfinApi } from './core';
import { useAudioStreamUrl } from './useAudioStreamUrl';

export function useAudioPlayback(initialItemId?: string) {
  const jellyfinApi = useJellyfinApi();
  const [currentItemId, setCurrentItemId] = React.useState<string | null>(initialItemId || null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [position, setPosition] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const soundRef = React.useRef<Audio.Sound | null>(null);
  
  // Get the streaming URL for the current item
  const streamUrl = useAudioStreamUrl(currentItemId || "");
  
  // Initialize and cleanup the audio session
  React.useEffect(() => {
    const setupAudio = async () => {
      try {
        // Set up audio mode for playback
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Failed to set audio mode:', error);
      }
    };
    
    setupAudio();
    
    return () => {
      if (soundRef.current) {
        const cleanup = async () => {
          try {
            await soundRef.current?.unloadAsync();
          } catch (error) {
            console.error('Error unloading sound:', error);
          }
        };
        cleanup();
      }
    };
  }, []);
  
  // Update the audio source when the item changes
  React.useEffect(() => {
    const loadSound = async () => {
      if (!streamUrl) {
        console.error('Cannot load audio: streamUrl is null or empty');
        return;
      }

      try {
        setLoading(true);
        console.log('Loading audio from URI:', streamUrl);
        
        // Unload previous sound
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        
        // Create new sound object
        const { sound } = await Audio.Sound.createAsync(
          { uri: streamUrl },
          { shouldPlay: isPlaying },
          onPlaybackStatusUpdate
        );
        
        soundRef.current = sound;
        setLoading(false);
      } catch (error) {
        console.error('Error loading audio:', error);
        setLoading(false);
      }
    };
    
    loadSound();
  }, [streamUrl]);
  
  // Handle playback status updates
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
      setPosition(status.positionMillis ? status.positionMillis / 1000 : 0);
      setIsPlaying(status.isPlaying);
      
      // If the track ended, update state
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };
  
  // Control functions
  const play = React.useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  }, []);
  
  const pause = React.useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  }, []);
  
  const seekTo = React.useCallback(async (time: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(time * 1000);
      setPosition(time);
    }
  }, []);
  
  const playItem = React.useCallback((itemId: string) => {
    setCurrentItemId(itemId);
    setIsPlaying(true);
  }, []);
  
  // Return the playback state and control functions
  return {
    currentItemId,
    isPlaying,
    duration,
    position,
    loading,
    play,
    pause,
    seekTo,
    playItem,
  };
} 