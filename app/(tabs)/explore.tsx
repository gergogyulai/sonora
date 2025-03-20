import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { SearchBar } from '../../components/SearchBar';
import { SongItem } from '../../components/SongItem';
import { MusicPlayer } from '../../components/MusicPlayer';
import { MiniPlayer } from '../../components/MiniPlayer';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { songs, albums, artists, playlists } from '../../models/MusicData';
import { Song, Album, Artist } from '../../models/MusicData';

type SearchResultsType = {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
};

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultsType>({
    songs: [],
    albums: [],
    artists: [],
  });
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentSong, setCurrentSong, setCurrentPlaylist } = useMusicPlayer();
  
  const openPlayer = () => {
    setIsPlayerVisible(true);
  };

  const closePlayer = () => {
    setIsPlayerVisible(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults({ songs: [], albums: [], artists: [] });
      setIsSearching(false);
      return;
    }
    
    // Simulate loading state
    setIsSearching(true);
    
    // Simple search logic (case-insensitive)
    const lowerQuery = query.toLowerCase();
    
    // Search through both sample and user songs
    const allSongs = [...songs, ...userSongs];
    
    // Search through songs
    const filteredSongs = allSongs.filter(song => 
      song.title.toLowerCase().includes(lowerQuery) || 
      song.artist.name.toLowerCase().includes(lowerQuery)
    );
    
    // Search through albums
    const filteredAlbums = albums.filter(album => 
      album.title.toLowerCase().includes(lowerQuery) || 
      album.artist.name.toLowerCase().includes(lowerQuery)
    );
    
    // Search through artists
    const filteredArtists = artists.filter(artist => 
      artist.name.toLowerCase().includes(lowerQuery)
    );
    
    // Simulate network delay
    setTimeout(() => {
      setSearchResults({
        songs: filteredSongs,
        albums: filteredAlbums,
        artists: filteredArtists,
      });
      setIsSearching(false);
    }, 500);
  };
  
  const pickMusicFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
        multiple: true,
      });
      
      if (result.canceled) {
        return;
      }
      
      console.log('Selected files:', result.assets);
      
      if (result.assets && result.assets.length > 0) {
        const newUserSongs: Song[] = result.assets.map((file, index) => {
          // Extract file name without extension to use as title
          const filename = file.name;
          const title = filename.substring(0, filename.lastIndexOf('.')) || filename;
          
          return {
            id: `user-song-${Date.now()}-${index}`,
            title: title,
            artist: { id: 'user', name: 'Your Library', imageUri: '' },
            album: { id: 'user-album', title: 'Imported Music', artist: { id: 'user', name: 'Your Library', imageUri: '' }, releaseDate: '', imageUri: '' },
            duration: 0, // Unknown duration until played
            uri: file.uri,
            imageUri: 'https://i.scdn.co/image/ab67616d0000b2734ab967e31dd8ef70e69811b3', // Default cover art
          };
        });
        
        setUserSongs(prev => [...prev, ...newUserSongs]);
        
        if (newUserSongs.length > 0) {
          // Play the first imported song
          setCurrentSong(newUserSongs[0]);
        }
        
        Alert.alert(
          'Music Imported',
          `Successfully imported ${newUserSongs.length} song${newUserSongs.length !== 1 ? 's' : ''}.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error importing music:', error);
      Alert.alert('Import Error', 'Failed to import music files. Please try again.');
    }
  };
  
  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Browse Categories</Text>
      <View style={styles.categories}>
        {['Hip Hop', 'Pop', 'Rock', 'Electronic', 'R&B', 'Jazz', 'Classical', 'Country'].map((category) => (
          <TouchableOpacity 
            key={category} 
            style={[styles.categoryItem, { backgroundColor: colors.cardBackground }]}
          >
            <Text style={[styles.categoryText, { color: colors.text }]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  const renderFeaturedPlaylists = () => (
    <View style={styles.playlistsContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Playlists</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredContent}
      >
        {playlists.map((playlist) => (
          <TouchableOpacity 
            key={playlist.id} 
            style={styles.featuredItem}
            onPress={() => setCurrentPlaylist(playlist.songs)}
          >
            <Image 
              source={{ uri: playlist.imageUri }} 
              style={styles.featuredImage}
            />
            <Text 
              style={[styles.featuredTitle, { color: colors.text }]} 
              numberOfLines={1}
            >
              {playlist.name}
            </Text>
            <Text 
              style={[styles.featuredSubtitle, { color: colors.icon }]} 
              numberOfLines={1}
            >
              {playlist.songs.length} songs
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderYourMusic = () => {
    if (userSongs.length === 0) return null;
    
    return (
      <View style={styles.userMusicContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Music</Text>
        {userSongs.map(song => (
          <SongItem 
            key={song.id} 
            song={song} 
            showArtwork={true} 
            showAlbumTitle={false}
          />
        ))}
      </View>
    );
  };

  const renderSearchResults = () => {
    const hasResults = searchResults.songs.length > 0 || 
                       searchResults.albums.length > 0 || 
                       searchResults.artists.length > 0;
    
    if (searchQuery && !hasResults && !isSearching) {
      return (
        <View style={styles.noResults}>
          <Ionicons name="search-outline" size={48} color={colors.icon} />
          <Text style={[styles.noResultsText, { color: colors.text }]}>
            No results found for "{searchQuery}"
          </Text>
        </View>
      );
    }
    
    return (
      <ScrollView style={styles.searchResults}>
        {searchResults.songs.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Songs</Text>
            {searchResults.songs.map(song => (
              <SongItem 
                key={song.id} 
                song={song} 
                showArtwork={true} 
                showAlbumTitle={true}
              />
            ))}
          </View>
        )}
        
        {searchResults.albums.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Albums</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {searchResults.albums.map(album => (
                <TouchableOpacity 
                  key={album.id}
                  style={styles.albumResult}
                >
                  <Image 
                    source={{ uri: album.imageUri }} 
                    style={styles.albumImage}
                  />
                  <Text 
                    style={[styles.albumTitle, { color: colors.text }]} 
                    numberOfLines={1}
                  >
                    {album.title}
                  </Text>
                  <Text 
                    style={[styles.albumArtist, { color: colors.icon }]} 
                    numberOfLines={1}
                  >
                    {album.artist.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {searchResults.artists.length > 0 && (
          <View style={[styles.resultSection, styles.lastSection]}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Artists</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {searchResults.artists.map(artist => (
                <TouchableOpacity 
                  key={artist.id}
                  style={styles.artistResult}
                >
                  <Image 
                    source={{ uri: artist.imageUri }} 
                    style={styles.artistImage}
                  />
                  <Text 
                    style={[styles.artistName, { color: colors.text }]} 
                    numberOfLines={1}
                  >
                    {artist.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Browse</Text>
        <TouchableOpacity 
          onPress={pickMusicFile}
          style={styles.importButton}
        >
          <Ionicons name="add-circle" size={24} color={colors.tint} />
          <Text style={{ color: colors.tint, marginLeft: 4 }}>Import</Text>
        </TouchableOpacity>
      </View>

      <SearchBar 
        onSearch={handleSearch} 
        isLoading={isSearching}
      />

      {searchQuery ? renderSearchResults() : (
        <ScrollView style={styles.content}>
          {renderYourMusic()}
          {renderFeaturedPlaylists()}
          {renderCategories()}
        </ScrollView>
      )}
      
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
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Space for mini player
  },
  userMusicContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  categoriesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  playlistsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  featuredContent: {
    paddingBottom: 16,
  },
  featuredItem: {
    width: 160,
    marginRight: 12,
  },
  featuredImage: {
    width: 160,
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  featuredSubtitle: {
    fontSize: 12,
  },
  searchResults: {
    flex: 1,
    paddingBottom: 80, // Space for mini player
  },
  resultSection: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  albumResult: {
    width: 120,
    marginRight: 12,
  },
  albumImage: {
    width: 120,
    height: 120,
    borderRadius: 4,
    marginBottom: 8,
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  albumArtist: {
    fontSize: 12,
  },
  artistResult: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  artistName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  lastSection: {
    marginBottom: 24,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  noResultsText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
