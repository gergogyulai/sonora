import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { Colors } from "../../../constants/Colors";
import { useAuth } from "../../../context/AuthContext";
import { useAlbumById, useSongById, useSongs } from "../../../lib/hooks/jellyfin";
import { useMusicPlayer } from "../../../context/MusicPlayerContext";
import { SongItem } from "../../../components/album-page/song-item";
import * as DropdownMenu from "zeego/dropdown-menu";
import * as ContextMenu from "zeego/context-menu";
import { LinearGradient } from "expo-linear-gradient";
import CoverHeader from "../../../components/album-page/cover-header";

function OptionsMenu({ colors }: { colors: any }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.tint} />
        </TouchableOpacity>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {/* Download and add to playlist */}
        <DropdownMenu.Group>
          <DropdownMenu.Item key="download">
            <DropdownMenu.ItemTitle>Download Album</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon ios={{ name: "arrow.down.circle" }} />
          </DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="sub-menu-trigger">
              <DropdownMenu.ItemTitle>Add to Playlist</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                ios={{ name: "rectangle.stack.badge.plus" }}
              />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item key="sub-menu-item-1">
                <DropdownMenu.ItemTitle>Sub Menu Item</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item key="sub-menu-item-2">
                <DropdownMenu.ItemTitle>Sub Menu Item</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item key="sub-menu-item-3">
                <DropdownMenu.ItemTitle>Sub Menu Item</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item key="sub-menu-item-4">
                <DropdownMenu.ItemTitle>Sub Menu Item</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item key="sub-menu-item-5">
                <DropdownMenu.ItemTitle>Sub Menu Item</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Group>

        {/* Metadata */}
        <DropdownMenu.Group>
          <DropdownMenu.Item key="metadata">
            <DropdownMenu.ItemTitle>Metadata</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon ios={{ name: "info.circle" }} />
          </DropdownMenu.Item>
        </DropdownMenu.Group>

        {/* Play control items */}
        <DropdownMenu.Group>
          <DropdownMenu.Item key="play-album">
            <DropdownMenu.ItemTitle>Play Album</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon ios={{ name: "play" }} />
          </DropdownMenu.Item>
          <DropdownMenu.Item key="play-next">
            <DropdownMenu.ItemTitle>Play Next</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{ name: "text.line.first.and.arrowtriangle.forward" }}
            />
          </DropdownMenu.Item>
          <DropdownMenu.Item key="play-last">
            <DropdownMenu.ItemTitle>Play Last</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{ name: "text.line.last.and.arrowtriangle.forward" }}
            />
          </DropdownMenu.Item>
        </DropdownMenu.Group>

        {/* Share */}
        <DropdownMenu.Group>
          <DropdownMenu.Item key="artist">
            <DropdownMenu.ItemTitle>Go to Artist</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon ios={{ name: "music.microphone" }} />
          </DropdownMenu.Item>
          <DropdownMenu.Item key="share">
            <DropdownMenu.ItemTitle>Share Album</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon ios={{ name: "square.and.arrow.up" }} />
          </DropdownMenu.Item>
        </DropdownMenu.Group>

        {/* Add to favorites */}
        <DropdownMenu.Group>
          <DropdownMenu.Item key="add-to-favorites">
            <DropdownMenu.ItemTitle>Add to Favorites</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon ios={{ name: "heart" }} />
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function getAppleMusicQualityLabel(bitrate: number): string {
  if (bitrate <= 64) {
    return "High Efficiency";
  } else if (bitrate === 256) {
    return "High Quality";
  } else if (bitrate <= 1411) {
    return "Lossless";
  } else if (bitrate > 1411) {
    return "Hi-Res Lossless";
  } else {
    return "Unknown Quality";
  }
}

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { serverUrl, token } = useAuth();
  const {
    currentSong,
    setCurrentSong,
    setCurrentPlaylist,
    mapJellyfinItemToSong,
  } = useMusicPlayer();

  const albumId = Array.isArray(id) ? id[0] : id;
  console.log("albumId", albumId);

  const {
    data: albumResponse,
    isLoading: isLoadingAlbum,
    error: albumError,
  } = useAlbumById(albumId);

  const {
    data: songsResponse,
    isLoading: isLoadingSongs,
    error: songsError,
  } = useSongs(albumId);

  const { data: firstSongData } = useSongById(songsResponse?.data?.Items[0].Id);
  const firstSong = firstSongData?.data;
  // console.log("firstSong", JSON.stringify(firstSong, null, 2));

  const audioStream = firstSong?.MediaStreams?.find(
    (stream) => stream.Type === "Audio"
  );
  console.log("audioStream", JSON.stringify(audioStream, null, 2));

  const album = albumResponse?.data;
  const songsData = songsResponse?.data?.Items || [];

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

  const imageUrl =
    serverUrl && albumId
      ? `${serverUrl}/Items/${albumId}/Images/Primary?fillHeight=500&fillWidth=500&quality=90`
      : null;

  const isLoading = isLoadingAlbum || isLoadingSongs;
  const error = albumError || songsError;

  // Handle play all button press
  const handlePlayAll = () => {
    if (songs.length > 0) {
      setCurrentPlaylist(songs);
      setCurrentSong(songs[0]);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Stack.Screen
          options={{
            headerShown: false,
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading album...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Stack.Screen
          options={{
            headerShown: false,
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.icon} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Error loading album: {error.message}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      />

      {/* Custom header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={colors.tint} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Album</Text>
        <View style={styles.headerRight}>
          <OptionsMenu colors={colors} />
        </View>
      </View>

      {/* Album details */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            <SongItem
              song={item}
              showArtwork={false}
              showAlbumTitle={false}
              showArtist={false}
              index={1}
              onPress={() => {
                setCurrentPlaylist(songs);
                setCurrentSong(item);
              }}
            />
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.albumHeader}>
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
            {/* <CoverHeader
              imageUrl={imageUrl}
              token={token}
              colors={colors}
            /> */}

            <View style={styles.albumInfo}>
              <Text style={[styles.albumTitle, { color: colors.text }]}>
                {album?.Name || "Unknown Album"}
              </Text>
              <Text style={[styles.albumArtist, { color: colors.tint }]}>
                {album?.AlbumArtist ||
                  (album?.Artists && album.Artists.length > 0
                    ? album.Artists[0]
                    : "Unknown Artist")}
              </Text>
              <Text style={[styles.audioQuality, { color: colors.text }]}>
                {/* {album.GenreItems?.[0]?.Name} ·{" "}  */}
                {album.ProductionYear} ·{" "}
                {Math.round((audioStream?.BitRate || 0) / 1000)} kbps ·{" "}
                {audioStream?.Codec?.toUpperCase()}
              </Text>
            </View>

            {songs.length > 0 && (
              <View style={styles.controls}>
                <TouchableOpacity
                  style={[styles.playButton, { backgroundColor: colors.tint }]}
                  activeOpacity={0.7}
                  onPress={handlePlayAll}
                >
                  <Ionicons name="play" size={24} color="white" />
                  <Text style={styles.playButtonText}>Play All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.playButton, { backgroundColor: colors.tint }]}
                  activeOpacity={0.7}
                  onPress={handlePlayAll}
                >
                  <Ionicons name="shuffle" size={24} color="white" />
                  <Text style={styles.playButtonText}>Shuffle</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.listFooter}>
            <Text style={[styles.listFooterText, { color: colors.icon }]}>
              {new Date(album?.PremiereDate).toLocaleDateString()}
            </Text>
            <Text style={[styles.listFooterText, { color: colors.icon }]}>
              {songs.length} songs, {formatDuration(album?.RunTimeTicks)}
            </Text>
          </View>
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: currentSong ? 120 : 80 },
        ]} // Add padding for tab bar
      />
    </SafeAreaView>
  );
}

// Helper function to format duration
const formatDuration = (ticks: number) => {
  if (!ticks) return "0 minutes";

  const seconds = Math.floor(ticks / 10000000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
      minutes !== 1 ? "s" : ""
    }`;
  } else {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 44, // Balance header layout
  },
  albumHeader: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  albumCover: {
    width: 256,
    height: 256,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  backgroundAlbumCover: {
    width: 286,
    height: 286,
    position: "absolute",
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  albumInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  albumTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  albumArtist: {
    fontSize: 22,
    marginBottom: 4,
  },
  audioQuality: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  songCount: {
    fontSize: 14,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 16,
    justifyContent: "space-between",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "48%",
  },
  playButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  shuffleButton: {
    padding: 10,
  },
  listContent: {
    paddingBottom: 24,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 14,
  },
  songDuration: {
    fontSize: 14,
    marginLeft: 16,
  },
  listFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listFooterText: {
    fontSize: 14,
  },
});
