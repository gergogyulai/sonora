import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { formatTime } from '../utils/timeUtils';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface MusicPlayerProps {
  onClose: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onClose }) => {
  const {
    currentSong,
    isPlaying,
    duration,
    position,
    isLoading,
    error,
    playCurrentSong,
    pauseCurrentSong,
    playNextSong,
    playPreviousSong,
    skipToPosition,
    setIsSliding,
    clearError,
  } = useMusicPlayer();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Set up animation for swipe-down gesture
  const translateY = useRef(new Animated.Value(0)).current;
  
  // Set up pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward movement (positive deltaY)
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          // If swiped down enough, close the player
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          // Reset to original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    })
  ).current;

  if (!currentSong) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.playerBackground }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="chevron-down" size={30} color={colors.playerText} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.playerText }]}>Now Playing</Text>
          <View style={styles.placeholderButton} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.noSongText, { color: colors.playerText }]}>
            No song selected
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePlayPausePress = async () => {
    if (isLoading) return;
    
    if (isPlaying) {
      await pauseCurrentSong();
    } else {
      if (error) clearError();
      await playCurrentSong();
    }
  };

  const handlePreviousPress = async () => {
    if (isLoading) return;
    if (error) clearError();
    await playPreviousSong();
  };

  const handleNextPress = async () => {
    if (isLoading) return;
    if (error) clearError();
    await playNextSong();
  };

  const handleSlidingStart = () => {
    setIsSliding(true);
  };

  const handleSlidingComplete = async (value: number) => {
    if (isLoading) return;
    
    await skipToPosition(value);
    setIsSliding(false);
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.playerBackground,
          transform: [{ translateY }]
        }
      ]}
      {...panResponder.panHandlers}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="chevron-down" size={30} color={colors.playerText} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.playerText }]}>Now Playing</Text>
          <View style={styles.placeholderButton} />
        </View>

        {/* Swipe indicator */}
        <View style={styles.swipeIndicatorContainer}>
          <View style={[styles.swipeIndicator, { backgroundColor: colors.playerText + '50' }]} />
        </View>

        <View style={styles.content}>
          <View style={styles.artworkContainer}>
            <Image
              source={{ uri: currentSong.imageUri }}
              style={styles.artwork}
            />
            {isLoading && (
              <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <ActivityIndicator size="large" color={colors.tint} />
              </View>
            )}
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
              <TouchableOpacity onPress={clearError} style={styles.clearErrorButton}>
                <Text style={{ color: colors.tint }}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.songInfo}>
                <Text style={[styles.songTitle, { color: colors.playerText }]}>{currentSong.title}</Text>
                <Text style={[styles.artistName, { color: colors.playerText }]}>{currentSong.artist.name}</Text>
                <Text style={[styles.albumTitle, { color: colors.playerText }]}>{currentSong.album.title}</Text>
              </View>

              <View style={styles.progressContainer}>
                <Slider
                  style={styles.progressBar}
                  minimumValue={0}
                  maximumValue={duration}
                  value={position}
                  minimumTrackTintColor={colors.trackProgress}
                  maximumTrackTintColor={colors.trackBackground}
                  thumbTintColor={colors.trackProgress}
                  onSlidingStart={handleSlidingStart}
                  onSlidingComplete={handleSlidingComplete}
                  disabled={isLoading}
                />
                <View style={styles.timeContainer}>
                  <Text style={[styles.timeText, { color: colors.playerText }]}>
                    {formatTime(position / 1000)}
                  </Text>
                  <Text style={[styles.timeText, { color: colors.playerText }]}>
                    {formatTime(duration / 1000)}
                  </Text>
                </View>
              </View>
            </>
          )}

          <View style={styles.controls}>
            <TouchableOpacity 
              onPress={handlePreviousPress} 
              style={[styles.controlButton, isLoading && styles.disabledButton]}
              disabled={isLoading}
            >
              <Ionicons 
                name="play-skip-back" 
                size={30} 
                color={isLoading ? colors.icon + '80' : colors.playerText} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handlePlayPausePress} 
              style={[styles.playPauseButton, isLoading && styles.disabledButton]}
              disabled={isLoading}
            >
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'} 
                size={40} 
                color={isLoading ? colors.icon + '80' : colors.playerText} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleNextPress} 
              style={[styles.controlButton, isLoading && styles.disabledButton]}
              disabled={isLoading}
            >
              <Ionicons 
                name="play-skip-forward" 
                size={30} 
                color={isLoading ? colors.icon + '80' : colors.playerText} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderButton: {
    width: 46,
  },
  swipeIndicatorContainer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  swipeIndicator: {
    width: 36,
    height: 5,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  artworkContainer: {
    position: 'relative',
    width: '80%',
    aspectRatio: 1,
    marginVertical: 24,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  artwork: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
  songInfo: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  artistName: {
    fontSize: 18,
    marginBottom: 4,
    textAlign: 'center',
  },
  albumTitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeText: {
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  controlButton: {
    marginHorizontal: 30,
  },
  playPauseButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  noSongText: {
    fontSize: 18,
    marginTop: 60,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  clearErrorButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
}); 