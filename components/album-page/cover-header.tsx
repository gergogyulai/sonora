import { LinearGradient } from "expo-linear-gradient";
import { View, Image, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CoverHeader({
  imageUrl,
  token,
  colors,
}: {
  imageUrl: string | null;
  token: string;
  colors: any;
}) {
  return (
    <View>
      {imageUrl ? (
        <View style={styles.albumArtContainer}>
          <Image
            source={{
              uri: imageUrl,
              headers: token ? { "X-Emby-Token": token } : undefined,
            }}
            style={styles.backgroundAlbumCover}
            blurRadius={Platform.OS === "ios" ? 70 : 25}
          />
          <Image
            source={{
              uri: imageUrl,
              headers: token ? { "X-Emby-Token": token } : undefined,
            }}
            style={styles.albumCover}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", colors.background]}
            style={styles.gradient}
          />
        </View>
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
  );
}

const styles = StyleSheet.create({
  albumArtContainer: {
    position: "relative",
    width: 286,
    height: 286,
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
  },
  albumCover: {
    width: 256,
    height: 256,
    borderRadius: 8,
    marginBottom: 16,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
});
