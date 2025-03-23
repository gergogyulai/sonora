import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { SongItem } from '../../components/SongItem';
import { MusicPlayer } from '../../components/MusicPlayer';
import { MiniPlayer } from '../../components/MiniPlayer';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { songs, albums, playlists } from '../../models/MusicData';
import { useRecentlyPlayed } from '@/lib/hooks/jellyfin';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { currentSong, setCurrentPlaylist } = useMusicPlayer();
  const { data: recentlyPlayed, isLoading: recentlyPlayedLoading, isError: recentlyPlayedError } = useRecentlyPlayed();
  console.log(JSON.stringify(recentlyPlayed?.data, null, 2));
  const openPlayer = () => {
    setIsPlayerVisible(true);
  };

  const closePlayer = () => {
    setIsPlayerVisible(false);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ParallaxScrollView
        headerImage={{ uri: playlists[0].imageUri }}
        headerTitle="For You"
        headerHeight={200}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            Good {getTimeOfDay()}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Your music recommendations
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recently Played
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.tint }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {/* {recentlyPlayed?.data?.items.map((item: any) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.playlist}
                activeOpacity={0.7}
                onPress={() => setCurrentPlaylist(item.songs)}
              >
                <Image 
                  source={{ uri: item.imageUri }} 
                  style={styles.playlistImage}
                />
                <Text 
                  style={[styles.playlistName, { color: colors.text }]} 
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text 
                  style={[styles.playlistDescription, { color: colors.icon }]} 
                  numberOfLines={1}
                >
                  {item.description}
                </Text>
              </TouchableOpacity>
            ))} */}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Made For You
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.tint }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.featuredSection, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.featuredSectionHeader}>
              <View>
                <Text style={[styles.featuredTitle, { color: colors.text }]}>
                  Daily Mix 1
                </Text>
                <Text style={[styles.featuredSubtitle, { color: colors.icon }]}>
                  Based on your listening history
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.playButton, { backgroundColor: colors.tint }]}
                onPress={() => setCurrentPlaylist(songs)}
              >
                <Ionicons name="play" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {songs.slice(0, 3).map((song) => (
              <SongItem 
                key={song.id} 
                song={song} 
                showAlbumTitle={true} 
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              New Releases
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.tint }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {albums.map((album) => (
              <TouchableOpacity 
                key={album.id} 
                style={styles.album}
                activeOpacity={0.7}
              >
                <Image 
                  source={{ uri: album.imageUri }} 
                  style={styles.albumImage}
                />
                <Text 
                  style={[styles.albumTitle, { color: colors.text }]} 
                  numberOfLines={1}
                >
                  {album.title}
                </Text>
                <Text 
                  style={[styles.albumArtist, { color: colors.icon }]} 
                  numberOfLines={1}
                >
                  {album.artist.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ParallaxScrollView>
      
      {currentSong && (
        <>
          <MiniPlayer onPress={openPlayer} />
          <Modal
            animationType="slide"
            transparent={false}
            visible={isPlayerVisible}
            onRequestClose={closePlayer}
          >
            <MusicPlayer onClose={closePlayer} />
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
}

const getTimeOfDay = () => {
  const hours = new Date().getHours();
  if (hours < 12) return 'Morning';
  if (hours < 18) return 'Afternoon';
  return 'Evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for mini player
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 12,
  },
  playlist: {
    width: 150,
    marginHorizontal: 4,
  },
  playlistImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  playlistDescription: {
    fontSize: 12,
  },
  album: {
    width: 140,
    marginHorizontal: 4,
  },
  albumImage: {
    width: 140,
    height: 140,
    borderRadius: 4,
    marginBottom: 8,
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  albumArtist: {
    fontSize: 12,
  },
  featuredSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  featuredSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
