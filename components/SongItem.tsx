import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMusicPlayer, Song } from '../context/MusicPlayerContext';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

interface SongItemProps {
  song: Song;
  showArtwork?: boolean;
  showAlbumTitle?: boolean;
  onOptionsPress?: () => void;
  onPress?: () => void;
}

export const SongItem: React.FC<SongItemProps> = ({
  song,
  showArtwork = true,
  showAlbumTitle = true,
  onOptionsPress,
  onPress,
}) => {
  const { 
    currentSong, 
    isPlaying, 
    isLoading, 
    playCurrentSong, 
    pauseCurrentSong, 
    setCurrentSong 
  } = useMusicPlayer();
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const isCurrentSong = currentSong?.id === song.id;
  const isThisSongLoading = isLoading && isCurrentSong;
  
  const handlePress = () => {
    if (isLoading) return; // Prevent multiple clicks while loading
    
    if (onPress) {
      onPress();
    } else if (isCurrentSong) {
      isPlaying ? pauseCurrentSong() : playCurrentSong();
    } else {
      setCurrentSong(song);
    }
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isCurrentSong && styles.currentSongContainer
      ]} 
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isThisSongLoading}
    >
      {showArtwork && (
        <Image 
          source={{ uri: song.imageUri }} 
          style={styles.artwork} 
        />
      )}
      
      <View style={styles.infoContainer}>
        <Text 
          style={[
            styles.title, 
            { color: isCurrentSong ? colors.tint : colors.text }
          ]} 
          numberOfLines={1}
        >
          {song.title}
        </Text>
        
        <View style={styles.subtitleContainer}>
          {isCurrentSong && !isThisSongLoading && (
            <Ionicons 
              name="musical-note" 
              size={14} 
              color={colors.tint} 
              style={styles.playingIcon} 
            />
          )}
          
          <Text 
            style={[
              styles.subtitle, 
              { color: isCurrentSong ? colors.tint : colors.icon }
            ]} 
            numberOfLines={1}
          >
            {song.artist?.name || 'Unknown Artist'}
            {showAlbumTitle && song.album && ` • ${song.album.title}`}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightContainer}>
        {isThisSongLoading ? (
          <ActivityIndicator size="small" color={colors.tint} style={styles.loadingIndicator} />
        ) : (
          <>
            <Text style={[styles.duration, { color: colors.icon }]}>
              {formatDuration(song.duration)}
            </Text>
            
            {onOptionsPress && (
              <TouchableOpacity
                style={styles.optionsButton}
                onPress={onOptionsPress}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.icon} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  currentSongContainer: {
    backgroundColor: 'rgba(255, 45, 85, 0.08)',
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playingIcon: {
    marginRight: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    minWidth: 60,
    justifyContent: 'flex-end',
  },
  duration: {
    fontSize: 14,
    marginRight: 8,
  },
  optionsButton: {
    padding: 4,
  },
  loadingIndicator: {
    marginRight: 8,
  },
}); 