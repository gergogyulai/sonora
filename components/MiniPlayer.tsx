import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  GestureResponderEvent
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { formatTime } from '../utils/timeUtils';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

interface MiniPlayerProps {
  onPress: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress }) => {
  const {
    currentSong,
    isPlaying,
    isLoading,
    error,
    playCurrentSong,
    pauseCurrentSong,
    playNextSong,
    clearError
  } = useMusicPlayer();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!currentSong) return null;

  const handlePlayPausePress = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    
    if (error) clearError();
    
    if (isPlaying) {
      await pauseCurrentSong();
    } else {
      await playCurrentSong();
    }
  };

  const handleNextPress = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    
    if (error) clearError();
    await playNextSong();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.playerBackground }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.artworkContainer}>
          <Image
            source={{ uri: currentSong.imageUri }}
            style={styles.artwork}
          />
          {isLoading && (
            <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <ActivityIndicator size="small" color={colors.tint} />
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text 
            style={[styles.title, { color: colors.playerText }]} 
            numberOfLines={1}
          >
            {currentSong.title}
          </Text>
          <Text 
            style={[styles.artist, { color: colors.playerText }]} 
            numberOfLines={1}
          >
            {currentSong.artist.name}
          </Text>
          
          {error && (
            <Text style={[styles.errorText, { color: 'red' }]} numberOfLines={1}>
              Error: {error.length > 20 ? error.substring(0, 20) + '...' : error}
            </Text>
          )}
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={handlePlayPausePress}
            style={[styles.button, isLoading && styles.disabledButton]}
            disabled={isLoading}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={28}
              color={isLoading ? colors.playerText + '80' : colors.playerText}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleNextPress}
            style={[styles.button, isLoading && styles.disabledButton]}
            disabled={isLoading}
          >
            <Ionicons
              name="play-skip-forward"
              size={28}
              color={isLoading ? colors.playerText + '80' : colors.playerText}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View 
        style={[
          styles.progressBar, 
          { backgroundColor: colors.trackBackground }
        ]}
      >
        <View 
          style={[
            styles.progress, 
            { 
              backgroundColor: colors.trackProgress,
              width: `${error ? 100 : 0}%` // When there's an error, show full red bar
            }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  artworkContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  artist: {
    fontSize: 14,
    opacity: 0.8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  progressBar: {
    height: 2,
    width: '100%',
  },
  progress: {
    height: '100%',
  },
}); 