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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { formatTime } from '../utils/timeUtils';
import { useColorScheme, Platform } from 'react-native';
import { Colors } from '../constants/Colors';
import { BlurView } from 'expo-blur';
import { SFSymbol } from "react-native-sfsymbols";


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
      onPress={onPress}
      activeOpacity={1}
    >
      <BlurView
        intensity={100}
        // tint={colorScheme === 'dark' ? 'dark' : 'light'}
        tint="systemChromeMaterial"
        style={[styles.container, { backgroundColor: "rgba(9, 9, 9, 0.4)" }]}
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
            {Platform.select({
              ios: <SFSymbol name={isPlaying ? 'pause.fill' : 'play.fill'} size={24} color={colors.playerText} />,
              default: <MaterialIcons name={isPlaying ? 'play-arrow' : 'pause'} size={24} color={colors.playerText} />,
            })}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleNextPress}
            style={[styles.button, isLoading && styles.disabledButton]}
            disabled={isLoading}
          >
            {Platform.select({
              ios: <SFSymbol name="forward.fill" size={24} color={colors.playerText} />,
              default: <MaterialIcons name="play-arrow" size={24} color={colors.playerText} />,
            })}
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 56,
    left: 0,
    right: 0,
    borderRadius: 16,
    borderCurve: "circular",
    overflow: 'hidden',
    elevation: 5,
    zIndex: 10,
    marginHorizontal: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 8,
  },
  artworkContainer: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 8,
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
    fontSize: 14,
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
    gap: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 20,
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