import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAlbums, useSongs, useArtists, useImageUrl } from '../lib/hooks/useJellyfin';

// Define item types based on Jellyfin API response
interface JellyfinItem {
  Id: string;
  Name: string;
  AlbumArtist?: string;
  Artists?: string[];
  [key: string]: any;
}

export function JellyfinMusicExample() {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'albums' | 'songs' | 'artists'>('albums');
  
  // Fetch data based on selected tab
  const {
    data: albumsResponse,
    isLoading: isLoadingAlbums,
    error: albumsError
  } = useAlbums();
  
  const {
    data: songsResponse,
    isLoading: isLoadingSongs,
    error: songsError
  } = useSongs(selectedAlbumId || undefined);
  
  const {
    data: artistsResponse,
    isLoading: isLoadingArtists,
    error: artistsError
  } = useArtists();
  
  // Extract actual data from responses
  const albumsData = albumsResponse?.data;
  const songsData = songsResponse?.data;
  const artistsData = artistsResponse?.data;
  
  // Rendering helpers
  const renderAlbum = ({ item }: { item: JellyfinItem }) => {
    const imageUrl = useImageUrl(item.Id, 'Primary');
    
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => {
          setSelectedAlbumId(item.Id);
          setSelectedTab('songs');
        }}
      >
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.thumbnail}
          />
        )}
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.Name}</Text>
          <Text style={styles.itemSubtitle}>{item.AlbumArtist}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderSong = ({ item }: { item: JellyfinItem }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.Name}</Text>
          <Text style={styles.itemSubtitle}>
            {item.AlbumArtist || item.Artists?.join(', ') || 'Unknown Artist'}
          </Text>
        </View>
      </View>
    );
  };
  
  const renderArtist = ({ item }: { item: JellyfinItem }) => {
    const imageUrl = useImageUrl(item.Id, 'Primary');
    
    return (
      <TouchableOpacity style={styles.itemContainer}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.thumbnail}
          />
        )}
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.Name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Handle loading and error states
  const isLoading = isLoadingAlbums || isLoadingSongs || isLoadingArtists;
  const error = albumsError || songsError || artistsError;
  
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading {selectedTab}...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error: {(error as Error).message}</Text>
      </View>
    );
  }
  
  // Get the current data based on selected tab
  const getData = (): JellyfinItem[] => {
    switch (selectedTab) {
      case 'albums':
        return albumsData?.Items || [];
      case 'songs':
        return songsData?.Items || [];
      case 'artists':
        return artistsData?.Items || [];
      default:
        return [];
    }
  };
  
  // Get the render function based on selected tab
  const getRenderItem = () => {
    switch (selectedTab) {
      case 'albums':
        return renderAlbum;
      case 'songs':
        return renderSong;
      case 'artists':
        return renderArtist;
      default:
        return renderAlbum;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'albums' && styles.selectedTab]}
          onPress={() => setSelectedTab('albums')}
        >
          <Text style={styles.tabText}>Albums</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'songs' && styles.selectedTab]}
          onPress={() => setSelectedTab('songs')}
        >
          <Text style={styles.tabText}>Songs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'artists' && styles.selectedTab]}
          onPress={() => setSelectedTab('artists')}
        >
          <Text style={styles.tabText}>Artists</Text>
        </TouchableOpacity>
      </View>
      
      {selectedTab === 'songs' && selectedAlbumId && (
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedTab('albums')}>
          <Text style={styles.backButtonText}>← Back to Albums</Text>
        </TouchableOpacity>
      )}
      
      <FlatList
        data={getData()}
        renderItem={getRenderItem()}
        keyExtractor={(item) => item.Id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6200ee',
  },
  tabText: {
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    padding: 12,
    backgroundColor: 'white',
  },
  backButtonText: {
    color: '#6200ee',
    fontWeight: '500',
  },
}); 