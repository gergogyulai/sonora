import React from 'react';
import { StyleSheet, View, Text, Image, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { usePlaylistById } from '../../lib/hooks/useJellyfin';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { serverUrl, token } = useAuth();
  const { currentSong } = useMusicPlayer();
  
  const playlistId = Array.isArray(id) ? id[0] : id;
  
  const { 
    data: playlistResponse, 
    isLoading: isLoadingPlaylist, 
    error: playlistError 
  } = usePlaylistById(playlistId);
  
  const playlist = playlistResponse?.data;
  const playlistItems = playlist?.Items || [];
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Construct the playlist cover image URL
  const imageUrl = serverUrl && playlistId ? 
    `${serverUrl}/Items/${playlistId}/Images/Primary?fillHeight=500&fillWidth=500&quality=90` : null;
  
  const isLoading = isLoadingPlaylist;
  const error = playlistError;
  
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
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading playlist...</Text>
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
            Error loading playlist: {error.message}
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Playlist</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Playlist details */}
      <FlatList
        data={playlistItems}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => {
          // Just display song information, not playing yet
          return (
            <View style={styles.songItem}>
              <View style={styles.songInfo}>
                <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
                  {item.Name}
                </Text>
                <Text style={[styles.songArtist, { color: colors.icon }]} numberOfLines={1}>
                  {item.AlbumArtist || (item.Artists && item.Artists.length > 0 ? item.Artists[0] : 'Unknown Artist')}
                </Text>
              </View>
              <Text style={[styles.songDuration, { color: colors.icon }]}>
                {item.RunTimeTicks ? formatDuration(Math.floor(item.RunTimeTicks / 10000000)) : '0:00'}
              </Text>
            </View>
          );
        }}
        ListHeaderComponent={() => (
          <View style={styles.playlistHeader}>
            {imageUrl ? (
              <Image 
                source={{ 
                  uri: imageUrl,
                  headers: token ? { 'X-Emby-Token': token } : undefined
                }} 
                style={styles.playlistCover} 
              />
            ) : (
              <View style={[styles.playlistCover, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="list" size={80} color={colors.icon} />
              </View>
            )}
            
            <View style={styles.playlistInfo}>
              <Text style={[styles.playlistTitle, { color: colors.text }]}>
                {playlist?.Name || 'Unknown Playlist'}
              </Text>
              <Text style={[styles.songCount, { color: colors.icon }]}>
                {playlistItems.length} {playlistItems.length === 1 ? 'song' : 'songs'}
              </Text>
            </View>
            
            {playlistItems.length > 0 && (
              <View style={styles.controls}>
                <TouchableOpacity 
                  style={[styles.playButton, { backgroundColor: colors.tint }]}
                  onPress={() => {}}
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
  playlistHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  playlistCover: {
    width: 220,
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  playlistTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  songCount: {
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  playButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 80, // Space for bottom tab bar
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
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