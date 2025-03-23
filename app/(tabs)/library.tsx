import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity, Modal, Image, Animated, TextInput, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LibraryTabs } from '../../components/LibraryTabs';
import { SongItem } from '../../components/SongItem';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { albums, artists, playlists } from '../../models/MusicData';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MusicPlayer } from '../../components/MusicPlayer';
import { MiniPlayer } from '../../components/MiniPlayer';
import { useAuth } from '../../context/AuthContext';
import { useAlbums, useAllSongs, usePlaylists, useLibraryRefresh } from '../../lib/hooks/jellyfin';
import * as DropdownMenu from 'zeego/dropdown-menu';
import * as ContextMenu from 'zeego/context-menu';

// Define interface for JellyfinItem


function AlbumItemActionsContextMenu({ children }: { children: React.ReactNode }) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Group>
          <ContextMenu.Item key="info">
            <ContextMenu.ItemTitle>{"View Song Info"}</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon ios={{ name: "info.circle" }} />
          </ContextMenu.Item>
        </ContextMenu.Group>

        <ContextMenu.Item key="play-next">
          <ContextMenu.ItemTitle>{"Play Next"}</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{ name: "text.line.first.and.arrowtriangle.forward" }}
          />
        </ContextMenu.Item>
        <ContextMenu.Item key="play-last">
          <ContextMenu.ItemTitle>{"Play Last"}</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{ name: "text.line.last.and.arrowtriangle.forward" }}
          />
        </ContextMenu.Item>

        <ContextMenu.Group>
          <ContextMenu.Item key="download">
            <ContextMenu.ItemTitle>{"Download Album"}</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon ios={{ name: "arrow.down.circle" }} />
          </ContextMenu.Item>

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger key="sub-menu-trigger">
              <ContextMenu.ItemTitle>{"Add to Playlist"}</ContextMenu.ItemTitle>
              <ContextMenu.ItemIcon
                ios={{ name: "rectangle.stack.badge.plus" }}
              />
            </ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item key="sub-menu-item-1">
                <ContextMenu.ItemTitle>{"Sub Menu Item"}</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="sub-menu-item-2">
                <ContextMenu.ItemTitle>{"Sub Menu Item"}</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="sub-menu-item-3">
                <ContextMenu.ItemTitle>{"Sub Menu Item"}</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="sub-menu-item-4">
                <ContextMenu.ItemTitle>{"Sub Menu Item"}</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="sub-menu-item-5">
                <ContextMenu.ItemTitle>{"Sub Menu Item"}</ContextMenu.ItemTitle>
              </ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
        </ContextMenu.Group>

        <ContextMenu.Group>
          <ContextMenu.Item key="album">
            <ContextMenu.ItemTitle>{"Go to Album"}</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon ios={{ name: "music.note.house" }} />
          </ContextMenu.Item>
          <ContextMenu.Item key="artist">
            <ContextMenu.ItemTitle>{"Go to Artist"}</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon ios={{ name: "music.microphone" }} />
          </ContextMenu.Item>
        </ContextMenu.Group>

        <ContextMenu.Group>
          <ContextMenu.Item key="share">
            <ContextMenu.ItemTitle>{"Share Song"}</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon ios={{ name: "square.and.arrow.up" }} />
          </ContextMenu.Item>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
interface JellyfinItem {
  Id: string;
  Name: string;
  AlbumArtist?: string;
  Artists?: string[];
  [key: string]: any;
}

// Sort options
type SortField = 'name' | 'dateAdded' | 'artist' | 'album' | 'duration';
type SortOrder = 'asc' | 'desc';

interface SortOption {
  field: SortField;
  order: SortOrder;
  label: string;
}

const sortOptions: SortOption[] = [
  { field: 'name', order: 'asc', label: 'Name (A-Z)' },
  { field: 'name', order: 'desc', label: 'Name (Z-A)' },
  { field: 'dateAdded', order: 'desc', label: 'Recently Added' },
  { field: 'dateAdded', order: 'asc', label: 'Oldest Added' },
  { field: 'artist', order: 'asc', label: 'Artist (A-Z)' },
  { field: 'artist', order: 'desc', label: 'Artist (Z-A)' },
  { field: 'album', order: 'asc', label: 'Album (A-Z)' },
  { field: 'album', order: 'desc', label: 'Album (Z-A)' },
  { field: 'duration', order: 'asc', label: 'Duration (Shortest)' },
  { field: 'duration', order: 'desc', label: 'Duration (Longest)' },
];

// AlbumItem component for rendering album list items
const AlbumItem = ({ album }: { album: JellyfinItem }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { serverUrl, token } = useAuth();
  
  // Directly construct the image URL using the item ID
  const imageUrl = serverUrl && album.Id ? 
    `${serverUrl}/Items/${album.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90` : null;
  
  const navigateToAlbum = () => {
    router.push(`/album/${album.Id}`);
  };
  
  return (
    <TouchableOpacity style={styles.albumCard} activeOpacity={0.7} onPress={navigateToAlbum}>
      {imageUrl ? (
        <Image 
        source={{ 
          uri: imageUrl,
          headers: token ? { 'X-Emby-Token': token } : undefined
        }} 
        style={styles.albumCardImage} 
      />
    ) : (
      <View style={[styles.albumCardImage, { backgroundColor: colors.cardBackground }]}>
        <Ionicons name="disc" size={40} color={colors.icon} />
      </View>
    )}
    <View style={styles.albumCardInfo}>
      <Text style={[styles.albumCardTitle, { color: colors.text }]} numberOfLines={1}>
        {album.Name}
      </Text>
      <Text style={[styles.albumCardArtist, { color: colors.icon }]} numberOfLines={1}>
        {album.AlbumArtist || (album.Artists && album.Artists.length > 0 ? album.Artists[0] : 'Unknown Artist')}
      </Text>
    </View>
    </TouchableOpacity>
  );
};

// PlaylistItem component for rendering playlist list items
const PlaylistItem = ({ playlist }: { playlist: JellyfinItem }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { serverUrl, token } = useAuth();
  
  // Construct the image URL using the item ID
  const imageUrl = serverUrl && playlist.Id ? 
    `${serverUrl}/Items/${playlist.Id}/Images/Primary?fillHeight=300&fillWidth=300&quality=90` : null;
  
  const navigateToPlaylist = () => {
    router.push(`/playlist/${playlist.Id}`);
  };
  
  return (
    <TouchableOpacity style={styles.playlistItem} activeOpacity={0.7} onPress={navigateToPlaylist}>
      <View style={styles.playlistImageContainer}>
        {imageUrl ? (
          <Image 
            source={{ 
              uri: imageUrl,
              headers: token ? { 'X-Emby-Token': token } : undefined
            }} 
            style={styles.playlistImage} 
          />
        ) : (
          <View style={[styles.playlistImage, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name="list" size={40} color={colors.icon} />
          </View>
        )}
      </View>
      <View style={styles.playlistInfo}>
        <Text style={[styles.playlistTitle, { color: colors.text }]} numberOfLines={1}>
          {playlist.Name}
        </Text>
        <Text style={[styles.playlistSongCount, { color: colors.icon }]}>
          {playlist.ChildCount || 0} songs
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function LibraryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const { 
    currentSong, 
    setCurrentSong, 
    setCurrentPlaylist, 
    mapJellyfinItemToSong 
  } = useMusicPlayer();
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [sortedSongs, setSortedSongs] = useState<any[]>([]);
  const [sortedAlbums, setSortedAlbums] = useState<any[]>([]);
  const [sortedPlaylists, setSortedPlaylists] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshLibrary, refreshSongs, refreshAlbums, refreshPlaylists } = useLibraryRefresh();

  const { isAuthenticated, serverUrl, username, token, userId } = useAuth();

  // console.log("UserId:", userId);
  // console.log("Token:", token);

  const { data: albumsResponse, isLoading: isLoadingAlbums, error: albumsError } = useAlbums();
  const { data: songsResponse, isLoading: isLoadingSongs, error: songsError } = useAllSongs();
  const { data: playlistsResponse, isLoading: isLoadingPlaylists, error: playlistsError } = usePlaylists();
  
  const jellyfmAlbums = albumsResponse?.data?.Items || [];
  const jellyfmSongs = songsResponse?.data?.Items || [];
  const jellyfmPlaylists = playlistsResponse?.data?.Items || [];

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Sort data when it changes or sort option changes
  useEffect(() => {
    // Only sort if we have data to sort
    if (songsResponse?.data?.Items?.length > 0 || 
        albumsResponse?.data?.Items?.length > 0 ||
        playlistsResponse?.data?.Items?.length > 0) {
      sortData();
    }
  }, [songsResponse, albumsResponse, playlistsResponse, currentSort]);

  // Handle sorting based on current sort option
  const sortData = () => {
    // Sort songs
    const itemsToSort = songsResponse?.data?.Items || [];
    const sortedSongsData = [...itemsToSort].sort((a, b) => {
      switch (currentSort.field) {
        case 'name':
          return currentSort.order === 'asc' 
            ? a.Name.localeCompare(b.Name)
            : b.Name.localeCompare(a.Name);
        case 'dateAdded':
          return currentSort.order === 'asc'
            ? new Date(a.DateCreated || 0).getTime() - new Date(b.DateCreated || 0).getTime()
            : new Date(b.DateCreated || 0).getTime() - new Date(a.DateCreated || 0).getTime();
        case 'artist':
          const artistA = a.AlbumArtist || a.Artists?.[0] || '';
          const artistB = b.AlbumArtist || b.Artists?.[0] || '';
          return currentSort.order === 'asc'
            ? artistA.localeCompare(artistB)
            : artistB.localeCompare(artistA);
        case 'album':
          const albumA = a.Album || '';
          const albumB = b.Album || '';
          return currentSort.order === 'asc'
            ? albumA.localeCompare(albumB)
            : albumB.localeCompare(albumA);
        case 'duration':
          return currentSort.order === 'asc'
            ? (a.RunTimeTicks || 0) - (b.RunTimeTicks || 0)
            : (b.RunTimeTicks || 0) - (a.RunTimeTicks || 0);
        default:
          return 0;
      }
    });
    setSortedSongs(sortedSongsData);

    // Sort albums
    const albumsToSort = albumsResponse?.data?.Items || [];
    const sortedAlbumsData = [...albumsToSort].sort((a, b) => {
      switch (currentSort.field) {
        case 'name':
          return currentSort.order === 'asc'
            ? a.Name.localeCompare(b.Name)
            : b.Name.localeCompare(a.Name);
        case 'dateAdded':
          return currentSort.order === 'asc'
            ? new Date(a.DateCreated || 0).getTime() - new Date(b.DateCreated || 0).getTime()
            : new Date(b.DateCreated || 0).getTime() - new Date(a.DateCreated || 0).getTime();
        case 'artist':
          const artistA = a.AlbumArtist || a.Artists?.[0] || '';
          const artistB = b.AlbumArtist || b.Artists?.[0] || '';
          return currentSort.order === 'asc'
            ? artistA.localeCompare(artistB)
            : artistB.localeCompare(artistA);
        default:
          return 0;
      }
    });
    setSortedAlbums(sortedAlbumsData);

    // Sort playlists
    const playlistsToSort = playlistsResponse?.data?.Items || [];
    const sortedPlaylistsData = [...playlistsToSort].sort((a, b) => {
      switch (currentSort.field) {
        case 'name':
          return currentSort.order === 'asc'
            ? a.Name.localeCompare(b.Name)
            : b.Name.localeCompare(a.Name);
        case 'dateAdded':
          return currentSort.order === 'asc'
            ? new Date(a.DateCreated || 0).getTime() - new Date(b.DateCreated || 0).getTime()
            : new Date(b.DateCreated || 0).getTime() - new Date(a.DateCreated || 0).getTime();
        default:
          return 0;
      }
    });
    setSortedPlaylists(sortedPlaylistsData);
  };
  
  const openPlayer = () => {
    setIsPlayerVisible(true);
  };

  const closePlayer = () => {
    setIsPlayerVisible(false);
  };

  // Filter content based on search query
  const getFilteredContent = (items: any[]) => {
    if (!searchQuery) return items;
    
    return items.filter(item => {
      // Handle both Jellyfin format (uppercase) and mapped Song format (lowercase)
      const name = item.Name || item.title || '';
      const artist = item.AlbumArtist || 
                    (item.Artists && item.Artists.length > 0 ? item.Artists[0] : '') || 
                    (item.artist && item.artist.name) || '';
      const album = item.Album || (item.album && item.album.title) || '';
      
      return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
             album.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  // Process all songs for playback when data is loaded
  useEffect(() => {
    if (songsResponse?.data?.Items && songsResponse.data.Items.length > 0 && serverUrl) {
      // Map all songs to the format expected by the MusicPlayer
      const mappedSongs = songsResponse.data.Items.map((item: any) => 
        mapJellyfinItemToSong(item, serverUrl)
      );
      
      // Store the mapped songs in state for use in the playlist
      setSortedSongs(mappedSongs);
    }
  }, [songsResponse, serverUrl, mapJellyfinItemToSong]);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh the data for the current tab
      switch (activeTab) {
        case 0: // Songs
          await refreshSongs();
          break;
        case 1: // Albums
          await refreshAlbums();
          break;
        case 2: // Playlists
          await refreshPlaylists();
          break;
        default:
          await refreshLibrary();
          break;
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0: // Songs
        return (
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color={colors.icon} style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search songs..."
                  placeholderTextColor={colors.icon}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={colors.icon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <FlatList
              key="songs-list"
              data={getFilteredContent(sortedSongs)}
              keyExtractor={(item) => item.Id || item.id}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={colors.tint}
                />
              }
              renderItem={({ item }) => (
                <SongItem 
                  song={item}
                  showArtwork 
                  showAlbumTitle
                  onPress={() => {
                    // When a song is selected, set it as current and set playlist for next/previous navigation
                    const filteredSongs = getFilteredContent(sortedSongs);
                    setCurrentPlaylist(filteredSongs);
                    setCurrentSong(item);
                  }}
                />
              )}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                isLoadingSongs ? (
                  <View style={styles.comingSoon}>
                    <Text style={[styles.comingSoonText, { color: colors.text }]}>
                      Loading songs...
                    </Text>
                  </View>
                ) : songsError ? (
                  <View style={styles.comingSoon}>
                    <Text style={[styles.comingSoonText, { color: colors.text }]}>
                      Error loading songs: {songsError.message}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.comingSoon}>
                    <Text style={[styles.comingSoonText, { color: colors.text }]}>
                      No songs found
                    </Text>
                  </View>
                )
              }
            />
          </>
        );
      case 1: // Albums
        return (
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color={colors.icon} style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search albums..."
                  placeholderTextColor={colors.icon}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={colors.icon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <FlatList
              key="albums-grid"
              data={getFilteredContent(sortedAlbums)}
              keyExtractor={(item) => item.Id}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={colors.tint}
                />
              }
              renderItem={({ item }) => <AlbumItem album={item} />}
              contentContainerStyle={styles.gridContent}
              numColumns={2}
              columnWrapperStyle={styles.albumRow}
              ListEmptyComponent={
                isLoadingAlbums ? (
                  <View style={styles.comingSoon}>
                    <Text style={[styles.comingSoonText, { color: colors.text }]}>
                      Loading albums...
                    </Text>
                  </View>
                ) : albumsError ? (
                  <View style={styles.comingSoon}>
                    <Text style={[styles.comingSoonText, { color: colors.text }]}>
                      Error loading albums: {albumsError.message}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.comingSoon}>
                    <Text style={[styles.comingSoonText, { color: colors.text }]}>
                      No albums found
                    </Text>
                  </View>
                )
              }
            />
          </>
        );
      case 2: // Playlists
        return (
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color={colors.icon} style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search playlists..."
                  placeholderTextColor={colors.icon}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={colors.icon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <FlatList
              key="playlists-list"
              data={getFilteredContent(sortedPlaylists)}
              keyExtractor={(item) => item.Id}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={colors.tint}
                />
              }
              renderItem={({ item }) => <PlaylistItem playlist={item} />}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                isLoadingPlaylists ? (
                  <View style={styles.comingSoon}>
                    <Text style={[styles.comingSoonText, { color: colors.text }]}>
                      Loading playlists...
                    </Text>
                  </View>
                ) : playlistsError ? (
                  <View style={styles.comingSoon}>
                    <Text style={[styles.comingSoonText, { color: colors.text }]}>
                      Error loading playlists: {playlistsError.message}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.comingSoon}>
                    <Text style={[styles.comingSoonText, { color: colors.text }]}>
                      No playlists found
                    </Text>
                  </View>
                )
              }
            />
          </>
        );
      case 3: // Artists
        return (
          <View style={styles.comingSoon}>
            <Ionicons name="people-outline" size={64} color={colors.icon} />
            <Text style={[styles.comingSoonText, { color: colors.text }]}>
              Artists view coming soon
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Library</Text>
        <View style={styles.headerButtons}>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="filter-outline" size={24} color={colors.tint} />
              </TouchableOpacity>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {sortOptions.map((option) => (
                <DropdownMenu.Item 
                  key={`${option.field}-${option.order}`}
                  onSelect={() => setCurrentSort(option)}
                >
                  <DropdownMenu.ItemTitle>{option.label}</DropdownMenu.ItemTitle>
                  {currentSort.field === option.field && currentSort.order === option.order && (
                    <DropdownMenu.ItemIcon ios={{ name: "checkmark" }} />
                  )}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          
          <TouchableOpacity style={styles.headerButton} onPress={() => handleRefresh()}>
            <Ionicons name="refresh-outline" size={24} color={colors.tint} />
          </TouchableOpacity>
        </View>
      </View>
      
      <LibraryTabs 
        tabs={['Songs', 'Albums', 'Playlists', 'Artists', 'Genres']} 
        onChangeTab={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
        }} 
      />
      
      {renderContent()}
      
      {currentSong && (
        <>
          <MiniPlayer onPress={openPlayer} />
          <Modal
            animationType="slide"
            transparent={false}
            visible={isPlayerVisible}
            onRequestClose={closePlayer}
          >
            <MusicPlayer onClose={closePlayer} />
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 100, // Space for mini player
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingBottom: 100, // Space for mini player
  },
  albumRow: {
    justifyContent: 'space-between',
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  comingSoonText: {
    fontSize: 18,
    marginTop: 16,
  },
  albumCard: {
    width: '48%', // Less than 50% to allow for spacing
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  albumCardImage: {
    width: '100%',
    aspectRatio: 1, // Square image
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumCardInfo: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  albumCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  albumCardArtist: {
    fontSize: 12,
    fontWeight: '400',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  playlistImageContainer: {
    marginRight: 16,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  playlistSongCount: {
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    borderRadius: 10,
    height: 36,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 16,
    padding: 0,
  },
}); 