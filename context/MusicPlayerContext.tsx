import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import TrackPlayer, { 
  Event, 
  State, 
  useTrackPlayerEvents, 
  useProgress, 
  Capability,
  AppKilledPlaybackBehavior
} from 'react-native-track-player';
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
    uri: `${serverUrl}/Audio/${item.Id}/universal?audioCodec=mp3&maxStreamingBitrate=192000&api_key=${token}`,
    imageUri: item.Id ? `${serverUrl}/Items/${item.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90` : ''
  };
};

// Convert our Song to TrackPlayer Track format
const songToTrack = (song: Song) => {
  return {
    id: song.id,
    url: song.uri,
    title: song.title,
    artist: song.artist.name,
    album: song.album.title,
    artwork: song.imageUri,
    duration: song.duration,
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
  
  // Track player state
  const [currentSong, setCurrentSongData] = useState<Song | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get playback progress directly from TrackPlayer
  const { position, duration } = useProgress();
  
  // Setup TrackPlayer on mount
  useEffect(() => {
    const setupPlayer = async () => {
      try {
        // Initialize the player
        await TrackPlayer.setupPlayer({
          // Optional options
          minBuffer: 15,  // seconds
          maxBuffer: 50,  // seconds
          backBuffer: 10, // seconds
          waitForBuffer: true
        });
        
        // Configure player capabilities
        await TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious
          ],
          progressUpdateEventInterval: 1,
        });
        
        console.log('[MusicPlayer] TrackPlayer initialized successfully');
      } catch (err) {
        console.error('[MusicPlayer] Failed to set up TrackPlayer:', err);
        setError(`Failed to set up audio: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    
    setupPlayer();
    
    // Clean up when component unmounts
    return () => {
      const teardown = async () => {
        try {
          await TrackPlayer.reset();
        } catch (error) {
          console.warn('[MusicPlayer] Error during cleanup:', error);
        }
      };
      
      teardown();
    };
  }, []);
  
  // Handle TrackPlayer events
  useTrackPlayerEvents([
    Event.PlaybackState,
    Event.PlaybackError,
    Event.PlaybackTrackChanged,
    Event.PlaybackQueueEnded
  ], async (event) => {
    switch (event.type) {
      case Event.PlaybackState:
        // Update isPlaying state based on player state
        const playerState = await TrackPlayer.getState();
        setIsPlaying(playerState === State.Playing);
        setIsLoading(playerState === State.Buffering || playerState === State.Connecting);
        break;
        
      case Event.PlaybackError:
        console.error('[MusicPlayer] Playback error:', event.message);
        setError(`Playback error: ${event.message}`);
        break;
        
      case Event.PlaybackTrackChanged:
        if (event.nextTrack !== undefined && event.nextTrack !== null) {
          try {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            if (track) {
              // Find the corresponding song from our playlist
              const nextSong = playlistSongs.find(song => song.id === track.id);
              if (nextSong) {
                setCurrentSongData(nextSong);
              }
            }
          } catch (error) {
            console.error('[MusicPlayer] Error getting current track:', error);
          }
        }
        break;
        
      case Event.PlaybackQueueEnded:
        console.log('[MusicPlayer] Playback queue ended');
        // Queue ended, you could implement repeat behavior here
        break;
    }
  });
  
  // Set the current song
  const setCurrentSong = useCallback(async (song: Song) => {
    console.log('[MusicPlayer] Setting current song:', song.title);
    
    setCurrentSongData(song);
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert song to track format
      const track = songToTrack(song);
      
      // Reset queue and add the track
      await TrackPlayer.reset();
      await TrackPlayer.add(track);
      
      // Start playback
      await TrackPlayer.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('[MusicPlayer] Error in setCurrentSong:', error);
      setError(`Error playing ${song.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Set the current playlist
  const setCurrentPlaylist = useCallback(async (songs: Song[]) => {
    console.log('[MusicPlayer] Setting playlist with', songs.length, 'songs');
    
    if (songs.length === 0) return;
    
    setPlaylistSongs(songs);
    setIsLoading(true);
    
    try {
      // Convert songs to tracks
      const tracks = songs.map(songToTrack);
      
      // Reset queue and add all tracks
      await TrackPlayer.reset();
      await TrackPlayer.add(tracks);
      
      // Update current song data
      setCurrentSongData(songs[0]);
    } catch (error) {
      console.error('[MusicPlayer] Error setting playlist:', error);
      setError(`Error setting playlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Play the current song
  const playCurrentSong = useCallback(async () => {
    console.log('[MusicPlayer] Attempting to play current song');
    
    if (isLoading) {
      console.log('[MusicPlayer] Cannot play - currently loading');
      return Promise.resolve();
    }
    
    try {
      await TrackPlayer.play();
      return Promise.resolve();
    } catch (error) {
      console.error('[MusicPlayer] Error playing song:', error);
      setError(`Error playing: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return Promise.reject(error);
    }
  }, [isLoading]);
  
  // Pause the current song
  const pauseCurrentSong = useCallback(async () => {
    console.log('[MusicPlayer] Pausing current song');
    
    if (isLoading) {
      return Promise.resolve();
    }
    
    try {
      await TrackPlayer.pause();
      return Promise.resolve();
    } catch (error) {
      console.error('[MusicPlayer] Error pausing song:', error);
      setError(`Error pausing: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return Promise.reject(error);
    }
  }, [isLoading]);
  
  // Get the index of the current song in the playlist
  const getCurrentSongIndex = useCallback(async () => {
    if (!currentSong || playlistSongs.length === 0) return -1;
    
    try {
      const currentTrackIndex = await TrackPlayer.getCurrentTrack();
      return currentTrackIndex !== null ? currentTrackIndex : -1;
    } catch (error) {
      console.error('[MusicPlayer] Error getting current track index:', error);
      return -1;
    }
  }, [currentSong, playlistSongs]);
  
  // Play the next song in the playlist
  const playNextSong = useCallback(async () => {
    console.log('[MusicPlayer] Playing next song');
    
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error('[MusicPlayer] Error playing next song:', error);
      setError(`Error playing next song: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);
  
  // Play the previous song in the playlist
  const playPreviousSong = useCallback(async () => {
    console.log('[MusicPlayer] Playing previous song');
    
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error('[MusicPlayer] Error playing previous song:', error);
      setError(`Error playing previous song: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);
  
  // Skip to a specific position
  const skipToPosition = useCallback(async (positionMillis: number) => {
    console.log('[MusicPlayer] Skipping to position:', positionMillis);
    
    if (isLoading) return;
    
    try {
      await TrackPlayer.seekTo(positionMillis / 1000); // TrackPlayer uses seconds, not milliseconds
    } catch (error) {
      console.error('[MusicPlayer] Error skipping to position:', error);
      setError(`Error seeking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [isLoading]);
  
  // Clear any errors
  const clearError = useCallback(() => {
    console.log('[MusicPlayer] Clearing error');
    setError(null);
  }, []);
  
  // Context value
  const value = {
    currentSong,
    isPlaying,
    duration: duration * 1000, // Convert to milliseconds to maintain compatibility
    position: position * 1000, // Convert to milliseconds to maintain compatibility
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