import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS, AVPlaybackStatus } from 'expo-av';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';

// Song interface representing a Jellyfin audio item
export interface Song {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
    imageUri: string;
  };
  album: {
    id: string;
    title: string;
    artist: {
      id: string;
      name: string;
      imageUri: string;
    };
    releaseDate: string;
    imageUri: string;
  };
  duration: number; // in seconds
  uri: string;
  imageUri: string;
}

// Map Jellyfin item to our Song format
const mapJellyfinItemToSong = (item: any, serverUrl: string, token: string = ''): Song => {
  return {
    id: item.Id,
    title: item.Name,
    artist: {
      id: item.AlbumArtistId || item.ArtistItems?.[0]?.Id || 'unknown',
      name: item.AlbumArtist || item.ArtistItems?.[0]?.Name || item.Artists?.[0] || 'Unknown Artist',
      imageUri: serverUrl ? `${serverUrl}/Items/${item.AlbumArtistId || item.ArtistItems?.[0]?.Id || item.Id}/Images/Primary` : ''
    },
    album: {
      id: item.AlbumId || 'unknown',
      title: item.Album || 'Unknown Album',
      artist: {
        id: item.AlbumArtistId || 'unknown',
        name: item.AlbumArtist || 'Unknown Artist',
        imageUri: ''
      },
      releaseDate: item.PremiereDate || '',
      imageUri: serverUrl ? `${serverUrl}/Items/${item.AlbumId}/Images/Primary?fillHeight=300&fillWidth=300&quality=90` : ''
    },
    duration: item.RunTimeTicks ? Math.floor((item.RunTimeTicks / 10000000)) : 0,
    uri: `${serverUrl}/Audio/${item.Id}/universal?audioCodec=aac,mp3&api_key=${token}`,
    imageUri: item.Id ? `${serverUrl}/Items/${item.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90` : ''
  };
};

interface MusicPlayerContextProps {
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  position: number;
  isLoading: boolean;
  error: string | null;
  setCurrentSong: (song: Song) => void;
  setCurrentPlaylist: (songs: Song[]) => void;
  playCurrentSong: () => Promise<void>;
  pauseCurrentSong: () => Promise<void>;
  playNextSong: () => void;
  playPreviousSong: () => void;
  skipToPosition: (positionMillis: number) => void;
  setIsSliding: (isSliding: boolean) => void;
  clearError: () => void;
  mapJellyfinItemToSong: (item: any, serverUrl: string) => Song;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { serverUrl, token } = useAuth();
  
  // Audio playback state
  const [currentSong, setCurrentSongData] = useState<Song | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Audio playback references
  const soundRef = useRef<Audio.Sound | null>(null);
  const soundObjectLoaded = useRef<boolean>(false);
  const playbackUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const currentSongRef = useRef<Song | null>(null);
  
  // Set up audio mode once on component mount
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log('[MusicPlayer] Audio mode set successfully');
      } catch (err) {
        console.error("[MusicPlayer] Failed to set audio mode:", err);
        setError(`Failed to set up audio: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    
    setupAudio();
    
    // Clean up when the component unmounts
    return () => {
      cleanUpAudio();
    };
  }, []);
  
  // Update currentSongRef when currentSong changes
  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);
  
  // Handle playback status updates
  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.error(`[MusicPlayer] Playback error: ${status.error}`);
        setError(`Playback error: ${status.error}`);
      }
      return;
    }
    
    setIsPlaying(status.isPlaying);
    
    if (!isSliding && status.positionMillis !== undefined) {
      setPosition(status.positionMillis);
    }
    
    if (status.durationMillis !== undefined && status.durationMillis > 0) {
      setDuration(status.durationMillis);
    }
    
    if (status.didJustFinish) {
      console.log('[MusicPlayer] Track finished, playing next song');
      setTimeout(() => playNextSong(), 500); // Small delay to ensure proper cleanup
    }
  }, [isSliding]);
  
  // Clean up audio resources
  const cleanUpAudio = useCallback(async () => {
    console.log('[MusicPlayer] Cleaning up audio resources');
    
    if (playbackUpdateInterval.current) {
      clearInterval(playbackUpdateInterval.current);
      playbackUpdateInterval.current = null;
    }
    
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
        }
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.warn('[MusicPlayer] Error during audio cleanup:', error);
      } finally {
        soundRef.current = null;
        soundObjectLoaded.current = false;
      }
    }
  }, []);
  
  // Load sound with improved error handling and retry logic
  const loadSound = useCallback(async (song: Song): Promise<boolean> => {
    console.log('[MusicPlayer] Loading sound:', song.title);
    
    if (!song || !song.uri) {
      console.error('[MusicPlayer] Invalid song or URI');
      setError('Cannot play song: Missing audio data');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Clean up any existing audio first
      await cleanUpAudio();
      
      console.log('[MusicPlayer] Creating sound object for URI:', song.uri);
      
      // Create the new sound object
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: song.uri },
        { progressUpdateIntervalMillis: 1000 },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
      
      if (!status.isLoaded) {
        throw new Error('Failed to load audio');
      }
      
      soundObjectLoaded.current = true;
      setDuration(status.durationMillis || 0);
      console.log('[MusicPlayer] Sound loaded successfully');
      
      return true;
    } catch (error) {
      console.error('[MusicPlayer] Error loading sound:', error);
      setError(`Could not load "${song.title}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [onPlaybackStatusUpdate, cleanUpAudio]);
  
  // Play the current song
  const playCurrentSong = useCallback(async () => {
    console.log('[MusicPlayer] Attempting to play current song');
    
    if (isLoading) {
      console.log('[MusicPlayer] Cannot play - currently loading');
      return Promise.resolve();
    }
    
    if (!currentSong) {
      console.log('[MusicPlayer] Cannot play - no current song');
      return Promise.resolve();
    }
    
    try {
      setIsPlaying(true);
      
      if (!soundRef.current || !soundObjectLoaded.current) {
        console.log('[MusicPlayer] No sound object, loading song first');
        await loadSound(currentSong);
      }
      
      if (soundRef.current) {
        console.log('[MusicPlayer] Playing sound');
        await soundRef.current.playAsync();
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('[MusicPlayer] Error playing song:', error);
      setError(`Error playing ${currentSong.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsPlaying(false);
      return Promise.reject(error);
    }
  }, [isLoading, currentSong, loadSound]);
  
  // Set the current song with improved handling
  const setCurrentSong = useCallback(async (song: Song) => {
    console.log('[MusicPlayer] Setting current song:', song.title);
    
    if (currentSongRef.current?.id === song.id && soundObjectLoaded.current) {
      console.log('[MusicPlayer] Song already loaded, just playing');
      setCurrentSongData(song);
      playCurrentSong();
      return;
    }
    
    // Set the song data immediately for UI updates
    setCurrentSongData(song);
    
    // Then load and play the song
    const loaded = await loadSound(song);
    if (loaded) {
      playCurrentSong();
    }
  }, [loadSound, playCurrentSong]);
  
  // Set the current playlist
  const setCurrentPlaylist = useCallback((songs: Song[]) => {
    console.log('[MusicPlayer] Setting playlist with', songs.length, 'songs');
    setPlaylistSongs(songs);
  }, []);
  
  // Pause the current song
  const pauseCurrentSong = useCallback(async () => {
    console.log('[MusicPlayer] Pausing current song');
    
    if (isLoading) {
      return Promise.resolve();
    }
    
    try {
      if (soundRef.current && soundObjectLoaded.current) {
        await soundRef.current.pauseAsync();
      }
      
      setIsPlaying(false);
      return Promise.resolve();
    } catch (error) {
      console.error('[MusicPlayer] Error pausing song:', error);
      setError(`Error pausing: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return Promise.reject(error);
    }
  }, [isLoading]);
  
  // Get the index of the current song in the playlist
  const getCurrentSongIndex = useCallback(() => {
    if (!currentSong || playlistSongs.length === 0) return -1;
    return playlistSongs.findIndex(song => song.id === currentSong.id);
  }, [currentSong, playlistSongs]);
  
  // Play the next song in the playlist
  const playNextSong = useCallback(() => {
    console.log('[MusicPlayer] Playing next song');
    
    try {
      const currentIndex = getCurrentSongIndex();
      
      if (currentIndex >= 0 && currentIndex < playlistSongs.length - 1) {
        // Play the next song in the playlist
        setCurrentSong(playlistSongs[currentIndex + 1]);
      } else if (playlistSongs.length > 0) {
        // Loop back to the first song
        setCurrentSong(playlistSongs[0]);
      } else {
        console.log('[MusicPlayer] No songs in playlist to play next');
      }
    } catch (error) {
      console.error('[MusicPlayer] Error playing next song:', error);
      setError(`Error playing next song: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [getCurrentSongIndex, playlistSongs, setCurrentSong]);
  
  // Play the previous song in the playlist
  const playPreviousSong = useCallback(() => {
    console.log('[MusicPlayer] Playing previous song');
    
    try {
      const currentIndex = getCurrentSongIndex();
      
      if (currentIndex > 0) {
        // Play the previous song
        setCurrentSong(playlistSongs[currentIndex - 1]);
      } else if (playlistSongs.length > 0) {
        // Loop to the last song
        setCurrentSong(playlistSongs[playlistSongs.length - 1]);
      } else {
        console.log('[MusicPlayer] No songs in playlist to play previous');
      }
    } catch (error) {
      console.error('[MusicPlayer] Error playing previous song:', error);
      setError(`Error playing previous song: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [getCurrentSongIndex, playlistSongs, setCurrentSong]);
  
  // Skip to a specific position
  const skipToPosition = useCallback(async (positionMillis: number) => {
    console.log('[MusicPlayer] Skipping to position:', positionMillis);
    
    if (isLoading) return;
    
    try {
      if (soundRef.current && soundObjectLoaded.current) {
        await soundRef.current.setPositionAsync(positionMillis);
        if (!isSliding) {
          setPosition(positionMillis);
        }
      } else {
        console.log('[MusicPlayer] Cannot seek - sound not loaded');
      }
    } catch (error) {
      console.error('[MusicPlayer] Error skipping to position:', error);
      setError(`Error seeking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [isLoading, isSliding]);
  
  // Clear any errors
  const clearError = useCallback(() => {
    console.log('[MusicPlayer] Clearing error');
    setError(null);
  }, []);
  
  // Context value
  const value = {
    currentSong,
    isPlaying,
    duration,
    position,
    isLoading,
    error,
    setCurrentSong,
    setCurrentPlaylist,
    playCurrentSong,
    pauseCurrentSong,
    playNextSong,
    playPreviousSong,
    skipToPosition,
    setIsSliding,
    clearError,
    mapJellyfinItemToSong: (item: any, serverUrl: string) => mapJellyfinItemToSong(item, serverUrl, token),
  };
  
  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}; 