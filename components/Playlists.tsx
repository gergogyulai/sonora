import React from 'react';
import { 
  StyleSheet, 
  FlatList, 
  View, 
  Text, 
  Image, 
  TouchableOpacity
} from 'react-native';
import { Playlist } from '../models/MusicData';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PlaylistsProps {
  playlists: Playlist[];
}

export const Playlists: React.FC<PlaylistsProps> = ({ playlists }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.createPlaylistButton, { backgroundColor: colors.cardBackground }]} 
        activeOpacity={0.7}
      >
        <View style={[styles.createPlaylistIcon, { backgroundColor: colors.tint }]}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </View>
        <Text style={[styles.createPlaylistText, { color: colors.text }]}>
          Create New Playlist
        </Text>
      </TouchableOpacity>
    
      <FlatList
        data={playlists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.playlistContainer} 
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: item.imageUri }} 
              style={styles.playlistImage}
            />
            <View style={styles.playlistInfo}>
              <Text 
                style={[styles.playlistName, { color: colors.text }]} 
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text 
                style={[styles.playlistDetails, { color: colors.icon }]}
                numberOfLines={1}
              >
                {item.songs.length} songs • {item.createdBy}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  createPlaylistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  createPlaylistIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPlaylistText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  playlistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  playlistDetails: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    marginVertical: 2,
  },
}); 