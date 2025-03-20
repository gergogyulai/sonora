import React from 'react';
import { 
  StyleSheet, 
  FlatList, 
  View, 
  Text, 
  Image, 
  TouchableOpacity,
  useWindowDimensions 
} from 'react-native';
import { Album } from '../models/MusicData';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

interface AlbumsProps {
  albums: Album[];
}

export const Albums: React.FC<AlbumsProps> = ({ albums }) => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Calculate the number of columns based on screen width
  const numColumns = Math.floor(width / 170);
  
  return (
    <FlatList
      data={albums}
      keyExtractor={item => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.albumContainer} activeOpacity={0.7}>
          <Image 
            source={{ uri: item.imageUri }} 
            style={styles.albumArt}
          />
          <View style={styles.albumInfo}>
            <Text 
              style={[styles.albumTitle, { color: colors.text }]} 
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text 
              style={[styles.albumArtist, { color: colors.icon }]}
              numberOfLines={1}
            >
              {item.artist.name}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  albumContainer: {
    flex: 1,
    margin: 8,
    maxWidth: 170,
    minWidth: 140,
  },
  albumArt: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  albumInfo: {
    marginTop: 8,
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  albumArtist: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 