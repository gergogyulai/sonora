import { LinearGradient } from "expo-linear-gradient";
import { Platform, StyleSheet } from "react-native";
import { View, Image } from "react-native";

const styles = StyleSheet.create({
  topBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  gradient: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export function TopBackground({ imageUrl, token, colors }: { imageUrl: string | null; token: string | null | undefined; colors: any; }) {
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
}
