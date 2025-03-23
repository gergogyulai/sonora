import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SongItem } from "../SongItem";


export default function SongsList({ songs, onSongPress, colors }: { songs: any[]; onSongPress: (song: any) => void; colors: any }) {
  return (
    <View
      style={[
        styles.songsListContainer,
        { backgroundColor: colors.background },
      ]}
    >
      {songs.map((song, index) => (
        <View
          key={song.id}
          style={[
            styles.songItemContainer,
            { borderBottomColor: "rgba(100, 100, 100, 0.1)" },
          ]}
        >
          <View style={styles.songNumberContainer}>
            <Text style={[styles.songNumber, { color: colors.icon }]}>
              {index + 1}
            </Text>
          </View>
          <SongItem
            song={song}
            showArtwork={false}
            showAlbumTitle={false}
            onPress={() => onSongPress(song)}
          />
          <TouchableOpacity style={styles.songMoreButton}>
            <MaterialIcons name="more-horiz" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
