import { View, Text, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";

export default function LoadingView({ colors }: { colors: any }) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.tint} />
      <Text style={[styles.loadingText, { color: colors.text }]}>
        Loading album...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
