import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMusicPlayer, Song } from "../../context/MusicPlayerContext";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import * as ContextMenu from "zeego/context-menu";
import * as DropdownMenu from "zeego/dropdown-menu";

function SongItemActionsDropdown({ colors, song }: { colors: any; song: Song }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity>
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

function SongItemActionsContextMenu({
  children,
  song,
}: {
  children: React.ReactNode;
  song: Song;
}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Group>
          <ContextMenu.Item key="info">
            <ContextMenu.ItemTitle>View Song Info</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon ios={{ name: "info.circle" }} />
          </ContextMenu.Item>
        </ContextMenu.Group>

        <ContextMenu.Item key="play-next">
          <ContextMenu.ItemTitle>Play Next</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{ name: "text.line.first.and.arrowtriangle.forward" }}
          />
        </ContextMenu.Item>
        <ContextMenu.Item key="play-last">
          <ContextMenu.ItemTitle>Play Last</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{ name: "text.line.last.and.arrowtriangle.forward" }}
          />
        </ContextMenu.Item>

        <ContextMenu.Group>
          <ContextMenu.Item key="download">
            <ContextMenu.ItemTitle>Download Album</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon ios={{ name: "arrow.down.circle" }} />
          </ContextMenu.Item>

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger key="sub-menu-trigger">
              <ContextMenu.ItemTitle>Add to Playlist</ContextMenu.ItemTitle>
              <ContextMenu.ItemIcon
                ios={{ name: "rectangle.stack.badge.plus" }}
              />
            </ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item key="sub-menu-item-1">
                <ContextMenu.ItemTitle>Sub Menu Item</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="sub-menu-item-2">
                <ContextMenu.ItemTitle>Sub Menu Item</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="sub-menu-item-3">
                <ContextMenu.ItemTitle>Sub Menu Item</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="sub-menu-item-4">
                <ContextMenu.ItemTitle>Sub Menu Item</ContextMenu.ItemTitle>
              </ContextMenu.Item>
              <ContextMenu.Item key="sub-menu-item-5">
                <ContextMenu.ItemTitle>Sub Menu Item</ContextMenu.ItemTitle>
              </ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
        </ContextMenu.Group>

        <ContextMenu.Group>
          <ContextMenu.Item key="album">
            <ContextMenu.ItemTitle>Go to Album</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon ios={{ name: "music.note.house" }} />
          </ContextMenu.Item>
          <ContextMenu.Item key="artist">
            <ContextMenu.ItemTitle>Go to Artist</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon ios={{ name: "music.microphone" }} />
          </ContextMenu.Item>
        </ContextMenu.Group>

        <ContextMenu.Group>
          <ContextMenu.Item key="share">
            <ContextMenu.ItemTitle>Share Song</ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon ios={{ name: "square.and.arrow.up" }} />
          </ContextMenu.Item>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

interface SongItemProps {
  song: Song;
  showArtwork?: boolean;
  showAlbumTitle?: boolean;
  showArtist?: boolean;
  onOptionsPress?: () => void;
  onPress?: () => void;
  index: number;
}

export const SongItem: React.FC<SongItemProps> = ({
  song,
  onOptionsPress,
  onPress,
  index
}) => {
  const {
    currentSong,
    isPlaying,
    isLoading,
    playCurrentSong,
    pauseCurrentSong,
    setCurrentSong,
  } = useMusicPlayer();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

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
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <SongItemActionsContextMenu song={song}>
      <TouchableOpacity
        style={[styles.container, isCurrentSong && styles.currentSongContainer]}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isThisSongLoading}
      >
        <View style={styles.infoContainer}>
          <View style={styles.indexContainer}>
            {(isCurrentSong || isThisSongLoading) ? (
              <Ionicons
                name="musical-note"
                size={18}
                color={colors.tint}
                style={styles.playingIcon}
              />
            ) : (
              <Text style={[styles.index, { color: colors.icon }]}>
                {index + 1}
              </Text>
            )}
          </View>
          <Text
            style={[
              styles.title,
              { color: isCurrentSong ? colors.tint : colors.text, width: "85%" },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {song.title}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          {isThisSongLoading ? (
            <ActivityIndicator
              size="small"
              color={colors.tint}
              style={styles.loadingIndicator}
            />
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
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
          <SongItemActionsDropdown colors={colors} song={song} />
        </View>
      </TouchableOpacity>
    </SongItemActionsContextMenu>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingRight: 12,
    borderRadius: 8,
  },
  currentSongContainer: {
    backgroundColor: "rgba(255, 45, 85, 0.08)",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    marginRight: 8,
  },
  playingIcon: {
    marginRight: 0,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 60,
    justifyContent: "flex-end",
  },
  duration: {
    fontSize: 14,
    marginRight: 12,
    opacity: 0.8,
  },
  optionsButton: {
    padding: 4,
  },
  loadingIndicator: {
    marginRight: 8,
  },
  index: {
    fontSize: 16,
    marginRight: 8,
  },
  indexContainer: {
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
