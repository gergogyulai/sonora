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
import { Artist } from '../models/MusicData';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

interface ArtistsProps {
  artists: Artist[];
}

export const Artists: React.FC<ArtistsProps> = ({ artists }) => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Calculate the number of columns based on screen width
  const numColumns = Math.floor(width / 150);
  
  return (
    <FlatList
      data={artists}
      keyExtractor={item => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.artistContainer} activeOpacity={0.7}>
          <Image 
            source={{ uri: item.imageUri }} 
            style={styles.artistImage}
          />
          <Text 
            style={[styles.artistName, { color: colors.text }]} 
            numberOfLines={1}
          >
            {item.name}
          </Text>
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
  artistContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    maxWidth: 150,
    minWidth: 120,
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  artistName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
}); 