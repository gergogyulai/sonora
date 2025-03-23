import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Easing,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { useAlbumById, useSongs } from "../../lib/hooks/jellyfin";
import { useMusicPlayer } from "../../context/MusicPlayerContext";
import { SongItem } from "../../components/SongItem";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import ErrorView from "@/components/album-page/error-view";
import LoadingView from "@/components/album-page/loading-view";
import SongsList from "@/components/album-page/song-list-view";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS === "ios" ? 40 : 100;
const ALBUM_COVER_SIZE = SCREEN_WIDTH * 0.55;
const MINI_ALBUM_SIZE = 40;
const TOP_SECTION_HEIGHT = SCREEN_HEIGHT * 0.55;

// Helper function to format duration
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Format album runtime from ticks
const formatAlbumRuntime = (runTimeTicks: number | undefined): string => {
  if (!runTimeTicks) return "0 minutes";

  const seconds = Math.floor(runTimeTicks / 10000000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
};

// Animated header that appears when scrolling
export function AnimatedHeader({ scrollY, album, imageUrl, token, colors, onBack }: {
  scrollY: Animated.Value;
  album: any;
  imageUrl: string | null;
  token: string | null | undefined;
  colors: any;
  onBack: () => void;
}) {
  const headerOpacity = scrollY.interpolate({
    inputRange: [ALBUM_COVER_SIZE, ALBUM_COVER_SIZE + 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [ALBUM_COVER_SIZE + 20, ALBUM_COVER_SIZE + 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.animatedHeader,
        {
          backgroundColor: colors.background,
          opacity: headerOpacity,
          borderBottomColor: "rgba(200, 200, 200, 0.25)",
          borderBottomWidth: 0.5,
        },
      ]}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={28} color={colors.tint} />
        </TouchableOpacity>

        <Animated.View
          style={[styles.headerTitleContainer, { opacity: titleOpacity }]}
        >

          <View style={styles.headerTextContainer}>
            <Text
              style={[styles.headerTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {album?.Name || "Unknown Album"}
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.icon }]}
              numberOfLines={1}
            >
              {album?.AlbumArtist ||
                (album?.Artists && album.Artists.length > 0
                  ? album.Artists[0]
                  : "Unknown Artist")}
            </Text>
          </View>
        </Animated.View>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.tint} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Album info section (cover, title, buttons)
export function AlbumInfo({ album, imageUrl, token, songs, onPlay, onShuffle, colors}: {
  album: any;
  imageUrl: string | null;
  token: string | null | undefined;
  songs: any[];
  onPlay: () => void;
  onShuffle: () => void;
  colors: any;
}) {
  return (
    <View style={styles.albumInfoContainer}>
      <View style={styles.albumImageContainer}>
        {imageUrl ? (
          <Image
            source={{
              uri: imageUrl,
              headers: token ? { "X-Emby-Token": token } : undefined,
            }}
            style={styles.albumCover}
          />
        ) : (
          <View
            style={[
              styles.albumCover,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Ionicons name="disc" size={80} color={colors.icon} />
          </View>
        )}
      </View>

      <View style={styles.albumMetaInfo}>
        <Text style={[styles.albumTitle, { color: colors.text }]}>
          {album?.Name || "Unknown Album"}
        </Text>
        <Text style={[styles.albumArtist, { color: "#ff2d55" }]}>
          {album?.AlbumArtist ||
            (album?.Artists && album.Artists.length > 0
              ? album.Artists[0]
              : "Unknown Artist")}
        </Text>

        <View style={styles.albumDetailsRow}>
          <Text style={[styles.albumDetailsText, { color: "#999" }]}>
            {album?.Genres && album.Genres.length > 0 ? album.Genres[0] : ""}{" "}
            {album?.PremiereDate
              ? "• " + new Date(album.PremiereDate).getFullYear()
              : ""}
          </Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: colors.background }]}
            onPress={onPlay}
          >
            <Ionicons name="play" size={20} color="#ff2d55" />
            <Text style={[styles.playButtonText, { color: "#ff2d55" }]}>
              Play
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shuffleButton,
              { backgroundColor: colors.background },
            ]}
            onPress={onShuffle}
          >
            <Ionicons name="shuffle" size={18} color="#ff2d55" />
            <Text style={[styles.shuffleButtonText, { color: "#ff2d55" }]}>
              Shuffle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-horiz" size={28} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Blurred background for the top section
export function TopBackground({ imageUrl, token, colors,}: { imageUrl: string | null; token: string | null | undefined; colors: any;}) {
  if (!imageUrl) return null;
  
  return (
    <View style={styles.topBackgroundContainer}>
      <Image
        source={{
          uri: imageUrl,
          headers: token ? { "X-Emby-Token": token } : undefined,
        }}
        style={styles.backgroundImage}
        blurRadius={Platform.OS === "ios" ? 50 : 20}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", colors.background]}
        style={styles.gradient}
      />
    </View>
  );
};

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { serverUrl, token } = useAuth();
  const { currentSong,setCurrentSong,setCurrentPlaylist,mapJellyfinItemToSong } = useMusicPlayer();

  const albumId = Array.isArray(id) ? id[0] : id;
  const scrollY = useRef(new Animated.Value(0)).current;

  const { data: albumResponse, isLoading: isLoadingAlbum, error: albumError } = useAlbumById(albumId);
  const { data: songsResponse, isLoading: isLoadingSongs, error: songsError } = useSongs(albumId);

  const album = albumResponse?.data;
  const songsData = songsResponse?.data?.Items || [];

  // Map songs to the format expected by MusicPlayer
  const songs = React.useMemo(() => {
    if (serverUrl && songsData.length > 0) {
      return songsData.map((item: any) =>
        mapJellyfinItemToSong(item, serverUrl)
      );
    }
    return [];
  }, [songsData, serverUrl, mapJellyfinItemToSong]);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Construct the album cover image URL
  const imageUrl = serverUrl && albumId ? `${serverUrl}/Items/${albumId}/Images/Primary?fillHeight=700&fillWidth=700&quality=90` : null;

  const isLoading = isLoadingAlbum || isLoadingSongs;
  const error = albumError || songsError;

  // Handle play all button press
  const handlePlayAll = () => {
    if (songs.length > 0) {
      setCurrentPlaylist(songs);
      setCurrentSong(songs[0]);
    }
  };

  // Handle shuffle button press
  const handleShuffle = () => {
    if (songs.length > 0) {
      const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
      setCurrentPlaylist(shuffledSongs);
      setCurrentSong(shuffledSongs[0]);
    }
  };

  const handleSongPress = (song: any) => {
    setCurrentPlaylist(songs);
    setCurrentSong(song);
  };

  const renderScreenContent = () => {
    if (isLoading) {
      return <LoadingView colors={colors} />;
    }

    if (error) {
      return (
        <ErrorView
          error={error}
          onRetry={() => router.back()}
          colors={colors}
        />
      );
    }

    return (
      <View style={styles.contentContainer}>
        <TopBackground imageUrl={imageUrl} token={token} colors={colors} />

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: currentSong ? 120 : 80 },
          ]}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <AlbumInfo
            album={album}
            imageUrl={imageUrl}
            token={token}
            songs={songs}
            onPlay={handlePlayAll}
            onShuffle={handleShuffle}
            colors={colors}
          />
          <SongsList
            songs={songs}
            onSongPress={handleSongPress}
            colors={colors}
          />
        </Animated.ScrollView>

        <AnimatedHeader
          scrollY={scrollY}
          album={album}
          imageUrl={imageUrl}
          token={token}
          colors={colors}
          onBack={() => router.back()}
        />

        <TouchableOpacity
          style={[styles.backButtonAbsolute]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar translucent />
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      />
      {renderScreenContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  topBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: TOP_SECTION_HEIGHT,
    zIndex: -1,
    overflow: "hidden",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  scrollContent: {
    flexGrow: 1,
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 100,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 8,
  },
  backButtonAbsolute: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 8,
    zIndex: 99,
    padding: 8,
  },
  backButton: {
    padding: 8,
    opacity: 0, // Hidden because we use backButtonAbsolute
  },
  headerButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 8,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  miniAlbumCover: {
    width: MINI_ALBUM_SIZE,
    height: MINI_ALBUM_SIZE,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  albumInfoContainer: {
    paddingTop: Platform.OS === "ios" ? 70 : 80,
    padding: 16,
    marginBottom: 20,
  },
  albumImageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  albumCover: {
    width: ALBUM_COVER_SIZE,
    height: ALBUM_COVER_SIZE,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  albumMetaInfo: {
    alignItems: "center",
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#fff",
  },
  albumArtist: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 8,
    color: "#ff2d55",
  },
  albumDetailsRow: {
    marginBottom: 20,
  },
  albumDetailsText: {
    fontSize: 14,
    color: "#999",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: "#111",
    flex: 1,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: "#333",
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: "#111",
    flex: 1,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: "#333",
  },
  shuffleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  moreButton: {
    padding: 8,
  },
  songsListContainer: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#000",
    paddingTop: 8,
  },
  songItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  songNumberContainer: {
    width: 30,
    alignItems: "center",
  },
  songNumber: {
    fontSize: 16,
  },
  songMoreButton: {
    padding: 8,
  },
});
