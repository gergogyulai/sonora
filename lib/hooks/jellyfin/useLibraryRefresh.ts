import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to provide methods for refreshing library data
 * by invalidating relevant parts of the React Query cache
 */
export function useLibraryRefresh() {
  const queryClient = useQueryClient();

  /**
   * Refresh all music library data
   */
  const refreshLibrary = () => {
    // Invalidate all library queries
    queryClient.invalidateQueries({ queryKey: ['albums'] });
    queryClient.invalidateQueries({ queryKey: ['songs'] });
    queryClient.invalidateQueries({ queryKey: ['playlists'] });
    queryClient.invalidateQueries({ queryKey: ['artists'] });
    queryClient.invalidateQueries({ queryKey: ['genres'] });
  };

  /**
   * Refresh specific parts of the library
   */
  const refreshSongs = () => {
    queryClient.invalidateQueries({ queryKey: ['songs'] });
  };

  const refreshAlbums = () => {
    queryClient.invalidateQueries({ queryKey: ['albums'] });
  };

  const refreshPlaylists = () => {
    queryClient.invalidateQueries({ queryKey: ['playlists'] });
  };

  const refreshArtists = () => {
    queryClient.invalidateQueries({ queryKey: ['artists'] });
  };

  const refreshGenres = () => {
    queryClient.invalidateQueries({ queryKey: ['genres'] });
  };

  /**
   * Refresh a specific item by ID
   */
  const refreshItem = (itemId: string, itemType: 'song' | 'album' | 'playlist' | 'artist' | 'genre') => {
    queryClient.invalidateQueries({ 
      queryKey: [`${itemType}`, itemId]
    });
  };

  return {
    refreshLibrary,
    refreshSongs,
    refreshAlbums,
    refreshPlaylists,
    refreshArtists,
    refreshGenres,
    refreshItem
  };
} 