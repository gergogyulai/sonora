import React from 'react';
import { StyleSheet, View, Text, Image, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { useAlbumById, useSongs } from '../../lib/hooks/jellyfin';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { SongItem } from '../../components/SongItem';

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { serverUrl, token } = useAuth();
  const { 
    currentSong, 
    setCurrentSong, 
    setCurrentPlaylist, 
    mapJellyfinItemToSong
  } = useMusicPlayer();
  
  const albumId = Array.isArray(id) ? id[0] : id;
  
  const { 
    data: albumResponse, 
    isLoading: isLoadingAlbum, 
    error: albumError 
  } = useAlbumById(albumId);
  
  const { 
    data: songsResponse, 
    isLoading: isLoadingSongs, 
    error: songsError 
  } = useSongs(albumId);
  
  const album = albumResponse?.data;
  const songsData = songsResponse?.data?.Items || [];
  
  // Map songs to the format expected by MusicPlayer
  const songs = React.useMemo(() => {
    if (serverUrl && songsData.length > 0) {
      return songsData.map((item: any) => mapJellyfinItemToSong(item, serverUrl));
    }
    return [];
  }, [songsData, serverUrl, mapJellyfinItemToSong]);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Construct the album cover image URL
  const imageUrl = serverUrl && albumId ? 
    `${serverUrl}/Items/${albumId}/Images/Primary?fillHeight=500&fillWidth=500&quality=90` : null;
  
  const isLoading = isLoadingAlbum || isLoadingSongs;
  const error = albumError || songsError;
  
  // Handle play all button press
  const handlePlayAll = () => {
    if (songs.length > 0) {
      setCurrentPlaylist(songs);
      setCurrentSong(songs[0]);
    }
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading album...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.icon} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Error loading album: {error.message}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      
      {/* Custom header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.tint} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Album</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Album details */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongItem 
            song={item}
            showArtwork={false}
            showAlbumTitle={false}
            onPress={() => {
              setCurrentPlaylist(songs);
              setCurrentSong(item);
            }}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.albumHeader}>
            {imageUrl ? (
              <Image 
                source={{ 
                  uri: imageUrl,
                  headers: token ? { 'X-Emby-Token': token } : undefined
                }} 
                style={styles.albumCover} 
              />
            ) : (
              <View style={[styles.albumCover, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="disc" size={80} color={colors.icon} />
              </View>
            )}
            
            <View style={styles.albumInfo}>
              <Text style={[styles.albumTitle, { color: colors.text }]}>
                {album?.Name || 'Unknown Album'}
              </Text>
              <Text style={[styles.albumArtist, { color: colors.icon }]}>
                {album?.AlbumArtist || (album?.Artists && album.Artists.length > 0 ? album.Artists[0] : 'Unknown Artist')}
              </Text>
              <Text style={[styles.songCount, { color: colors.icon }]}>
                {songs.length} {songs.length === 1 ? 'song' : 'songs'}
              </Text>
            </View>
            
            {songs.length > 0 && (
              <View style={styles.controls}>
                <TouchableOpacity 
                  style={[styles.playButton, { backgroundColor: colors.tint }]}
                  activeOpacity={0.7}
                  onPress={handlePlayAll}
                >
                  <Ionicons name="play" size={24} color="white" />
                  <Text style={styles.playButtonText}>Play All</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: currentSong ? 120 : 80 }]} // Add padding for tab bar
      />
      
    </SafeAreaView>
  );
}

// Helper function to format duration
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 44, // Balance header layout
  },
  albumHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  albumCover: {
    width: 220,
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  albumTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  albumArtist: {
    fontSize: 16,
    marginBottom: 4,
  },
  songCount: {
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginRight: 16,
  },
  playButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  shuffleButton: {
    padding: 10,
  },
  listContent: {
    paddingBottom: 24,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 14,
  },
  songDuration: {
    fontSize: 14,
    marginLeft: 16,
  },
}); 