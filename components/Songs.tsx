import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Song } from '../models/MusicData';
import { SongItem } from './SongItem';

interface SongsProps {
  songs: Song[];
}

export const Songs: React.FC<SongsProps> = ({ songs }) => {
  return (
    <FlatList
      data={songs}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <SongItem 
          song={item} 
          showArtwork={true} 
          showAlbumTitle={true}
          onOptionsPress={() => {}}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    marginVertical: 2,
  },
}); 